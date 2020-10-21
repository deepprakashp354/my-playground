import math
import json
from shapely.geometry import box, LineString, Polygon, MultiPolygon, GeometryCollection, Point
from matplotlib import pyplot as plt
from matplotlib.collections import PatchCollection
from descartes import PolygonPatch

# create fishnet
def fishnet(geometry, threshold, shapelyGeometry = False, options = {}):
    geometry = box(*geometry)
    bounds = geometry.bounds
    # min and max
    xmin = int(bounds[0] // threshold)
    xmax = int(bounds[2] // threshold)
    ymin = int(bounds[1] // threshold)
    ymax = int(bounds[3] // threshold)
    result = []

    # get fishnet
    for i in range(xmin, xmax+1):
        for j in range(ymin, ymax+1):
            b = box(i*threshold, j*threshold, (i+1)*threshold, (j+1)*threshold)
            g = geometry.intersection(b)
            if g.is_empty:
                continue
            result.append(g)

            # log
            if len(options) != 0 and options["log"] == True and "logPrefix" in options:
                print(options["logPrefix"]+" -> " + "X = "+str(i)+", Y = "+str(j))
    
    # convert to coords
    p = []
    for index in range(len(result)):
        if type(result[index]) is not LineString :
            p.append(list(result[index].exterior.coords))

    if shapelyGeometry is not True :
        return p
    else :
        return result

# katana algo
def katana(geometry, threshold, count=0, shapelyGeometry = False):
    """Split a Polygon into two parts across it's shortest dimension"""
    geometry = box(*geometry)
    bounds = geometry.bounds
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    if max(width, height) <= threshold or count == 250:
        # either the polygon is smaller than the threshold, or the maximum
        # number of recursions has been reached
        return [geometry]
    if height >= width:
        # split left to right
        a = box(bounds[0], bounds[1], bounds[2], bounds[1]+height/2)
        b = box(bounds[0], bounds[1]+height/2, bounds[2], bounds[3])
    else:
        # split top to bottom
        a = box(bounds[0], bounds[1], bounds[0]+width/2, bounds[3])
        b = box(bounds[0]+width/2, bounds[1], bounds[2], bounds[3])
    result = []
    for d in (a, b,):
        c = geometry.intersection(d)
        if not isinstance(c, GeometryCollection):
            c = [c]
        for e in c:
            if isinstance(e, (Polygon, MultiPolygon)):
                result.extend(katana(e, threshold, count+1))
    if count > 0:
        return result
    # convert multipart into singlepart
    final_result = []
    for g in result:
        if isinstance(g, MultiPolygon):
            final_result.extend(g)
        else:
            final_result.append(g)

    # convert to coords
    p = []
    for index in range(len(final_result)):
        if type(final_result[index]) is not LineString :
            p.append(list(final_result[index].exterior.coords))

    if shapelyGeometry is not True :
        return p
    else :
        return final_result

    # return final_result

# plot fish net
def plotFishNet(z):
    fig = plt.figure()
    ax = fig.add_subplot(122)
    ax.set_aspect('equal')
    patches = []

    for index in range(len(z)):
        if type(z[index]) is not LineString :
            patch = PolygonPatch(z[index], facecolor=[0, 0, 0, 0.5], edgecolor=[1, 1, 1], alpha=0.7, zorder=2)
            patches.append(patch)

    # draw
    patchCollection = PatchCollection(patches, color='white',lw=.6,edgecolor='k')
    ax.add_collection(patchCollection)
    ax.autoscale_view()
    plt.show()
    
# get nesw(north east, south west)
def nesw(bounds):
    min = [None] * 2
    max = [None] * 2

    for index in range(len(bounds)):
        if(index == 0):
            max[0] = bounds[index][0]
            max[1] = bounds[index][1]
            min[0] = bounds[index][0]
            min[1] = bounds[index][1]
        # max
        if(bounds[index][0] > max[0]):
            max[0] = bounds[index][0]
        if(bounds[index][1] > max[1]):
            max[1] = bounds[index][1]
        
        # min
        if(bounds[index][0] < min[0]):
            min[0] = bounds[index][0]
        if(bounds[index][1] < min[1]):
            min[1] = bounds[index][1]

    bbox = {}
    bbox["min"] = min
    bbox["max"] = max

    return bbox

# convert to shapely point
def point(l):
    return Point(*l)

# convert to polygon
def polygon(l):
    bx = box(*l)
    return bx

def shapelyPolygon(p):
    return Polygon(p)

# get distance
def getDistance(pt1, pt2):
    lon1 = pt1[0]
    lat1 = pt1[1]
    lon2 = pt2[0]
    lat2 = pt2[1]
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])
    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    # Radius of earth in kilometers is 6371
    km = 6371* c
    return km

# km to degree
def kmToDeg(value):
    return (value/6371.0) * (180/math.pi)

# km to radian
def kmToRad(value):
    return (value/6371.0)

# # z = fishnet(box(0.500, -0.250, 0.433, -0.433), 0.005, True)
# area = 1
# inrad = kmToDeg(area)
# print inrad
# z = fishnet([-117.8847, 33.7600, -117.8766, 33.7516], inrad, True)
# plotFishNet(z)