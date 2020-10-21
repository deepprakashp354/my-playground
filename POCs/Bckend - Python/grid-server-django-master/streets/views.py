from django.http import HttpResponse
import urllib.request
import json
from xml.etree import cElementTree as ET
from . import polygon

fishnet, nesw, kmToDeg, point, polygon, getDistance = polygon.fishnet, polygon.nesw, polygon.kmToDeg, polygon.point, polygon.polygon, polygon.getDistance

# divide the polygon
# get the streets
def getStreets(request):
    typeBound = request.GET.get('type')

    # if polygon
    if typeBound == 'polygon':
        bounds = request.GET.get('bounds')
        bounds = bounds.split(',')
    # if circle
    elif typeBound == 'circle':
        radius = kmToDeg(float(request.GET.get('radius')))
        center = request.GET.get('center').split(',')
        for i in range(len(center)):
            center[i] = float(center[i])

        bounds = bboxCircle(radius, center)
    # else
    else :
        resp = {}
        resp["status"] = False
        resp["message"] = "Unknown process"
        resp["data"] = None

        return HttpResponse(json.dumps(resp))

    # get streets in grid
    gridStreets = getPolygonStreets(bounds, request)
 
    resp = {}
    resp["status"] = True
    resp["message"] = "grids prepared successfully!"
    resp["data"] = gridStreets

    return HttpResponse(json.dumps(resp))

# get polygon streets
def getPolygonStreets(bounds, request):
    polygon = []
    streets = []

    # parse data
    for i in range(len(bounds)):
        polygon.append(float(bounds[i]))

    # for area of 1 sq km
    area = 1 #in sq km
    threshold = kmToDeg(area)
    # get fish net
    grids = fishnet(polygon, threshold, True)

    gridStreets = {}

    # fetch streets
    for index in range(len(grids)):
        poly = grids[index]
        bbox = [str(x) for x in poly.bounds]
        query = ','.join(bbox)

        # get the data
        url = "https://api.openstreetmap.org/api/0.6/map?bbox="+query
        response = urllib.request.urlopen(url)
        data = response.read()

        # parse xml
        root = ET.fromstring(data)

        ways = root.findall('way')
        nodes = root.findall('node')
        tags = root.findall('tag')
        streets = []

        for way in list(ways):
            streetName = ''
            isHighway = False
            wayChildren = way.getchildren()
            nds = []
            for wayChild in list(wayChildren):
                if wayChild.tag == "tag":
                    wayChildAttrib = wayChild.attrib

                    if "k" in wayChildAttrib and wayChildAttrib["k"] == "name":
                        streetName = wayChildAttrib["v"]
                    
                    if "k" in wayChildAttrib and wayChildAttrib["k"] == "highway":
                        isHighway = True
                    
                    if "k" in wayChildAttrib and wayChildAttrib["k"] == "lanes" and int(wayChildAttrib["v"]) > 2:
                        isHighway = False
                
                if wayChild.tag == "nd":
                    nds.append(wayChild)
    
            # get street and way points
            if isHighway:
                typeBound = request.GET.get('type')

                # if polygon
                if typeBound == "polygon":
                    segments = fetchAllSegmentsInsidePolygon(nds, nodes, polygon)
                # if cirlce
                elif typeBound == "circle":
                    radius = kmToDeg(float(request.GET.get('radius')))
                    center = request.GET.get('center').split(',')
                    for i in range(len(center)):
                        center[i] = float(center[i])

                    segments = fetchAllSegmentsInsideCircle(nds, nodes, radius, center)
                else :
                    return False

                if len(segments) > 1 :
                    obj = {}
                    obj["streetName"] = streetName if len(streetName) > 0 else "Unknown Street"
                    obj["wayPoints"] = {
                        "type": "MultiPoint",
                        "coordinates" : segments
                    } 
                    obj["distance"] =  {}

                    # append street
                    streets.append(obj)

        # get distance
        for val in streets:
            streetDist= 0
            totalDist= 0
            wayPtsCoords = val["wayPoints"]["coordinates"]
            for k in range(len(wayPtsCoords) - 1):
                pt1 = [wayPtsCoords[k][1], wayPtsCoords[k][0]]
                pt2 = [wayPtsCoords[k+1][1], wayPtsCoords[k+1][1]]

                streetDist = getDistance(pt1, pt2)

                totalDist += streetDist

            val["distance"] = {}
            val["distance"]["value"] = totalDist
            val["distance"]["unit"] = "meter"

        gridStreets["grid_"+str(index)] = streets

    return gridStreets

# Helper functions ############################################
# fetch all segments
def fetchAllSegmentsInsidePolygon(nds, nodes, bounds):
    arr = []
    for nd in list(nds):
        latlng = getLatLng(nodes, nd)
        # if isWithinBound(latlng, bounds):
        arr.append(latlng)
    
    if isPointsInBound(arr, bounds) is True:
        return arr
    else :
        return []

def fetchAllSegmentsInsideCircle(nds, nodes, r, center):
    arr = []
    for nd in list(nds):
        latlng = getLatLng(nodes, nd)
        # if isWithinBound(latlng, bounds):
        arr.append(latlng)
    
    if isPointsInCircle(center, r, arr) is True:
        return arr
    else :
        return []

# get lat lngs
def getLatLng(nodes, nd):
    o = []
    ndAttr = nd.attrib
    for node in nodes:
        attr = node.attrib
        if "id" in attr and attr["id"] == ndAttr["ref"]:
            o.append(float(attr["lon"]))
            o.append(float(attr["lat"]))
        
    return o

# is the list of all the points in bounds
def isPointsInBound(points, bounds):
    inBounds = True
    for o in points:
        if isWithinBound(o, bounds) is False:
            inBounds = False

    return inBounds

# is list of all the points in circle
def isPointsInCircle(center, radius, points):
    inBound = True
    
    for o in points:
        if isWithinCircle(center, radius, o) is False:
            inBound = False
        
    return inBound

# if point is in cirlc
def isWithinCircle(center, radius, point):
    center_x = center[0]
    center_y = center[1]

    x = point[0]
    y = point[1]

    square_dist = (center_x - x) ** 2 + (center_y - y) ** 2
    return square_dist <= radius ** 2

# is within point
def isWithinBound(o, bounds):
    pt = point(o)
    poly = polygon(list(bounds))

    return poly.contains(pt)

# bounding box for circle
def bboxCircle(radius, center):
    ne = [center[0] + radius, center[1] + radius]
    sw = [center[0] - radius, center[1] - radius]

    return ne+sw