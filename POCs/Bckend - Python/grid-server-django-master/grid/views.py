from django.http import HttpResponse
from django.conf import settings
import smtplib, ssl
import json
from . import models
from . import polygon

fishnet, plotFishNet, kmToDeg, nesw, point, shapelyPolygon = polygon.fishnet, polygon.plotFishNet, polygon.kmToDeg, polygon.nesw, polygon.point, polygon.shapelyPolygon

# create grids for states
def createGrids(request):
    usBounds = settings.BASE_DIR+'/common/us.json'
    # for area of 1 sq km
    print(settings.AREA_OF_TILE)
    area = settings.AREA_OF_TILE #in sq km
    threshold = kmToDeg(area)

    # load json file
    with open(usBounds) as json_file:
        data = json.load(json_file)
        
        # looping over states
        for state in data:
            stateName = state["name"]
            points = state["point"]

            # add state to db
            stateId = addState(stateName, points)
            if stateId is not False :
                print('State '+stateName+' added with id = '+str(stateId))
        
                # getting state bounds
                stateBound = convertPoints(points)
                bbox = nesw(stateBound)
                # bounds
                bound = bbox["min"] + bbox["max"]
                
                # get fish net
                print("creating fishnet for state - "+stateName)
                options = {}
                options["logPrefix"] = stateName
                options["log"] = True
                grids = fishnet(bound, threshold, False, options)
                filteredGrid = []

                # filtering data in state bound
                print("filtering grids for state - "+stateName)
                gridCount = 0
                for g in grids:
                    gridCount += 1
                    print("state -> "+stateName+", GridNo - "+str(gridCount))
                    # filter grid
                    if isGridInBound(g, stateBound) == True:
                        # filteredGrid.append(g)
                        addTileGrid(stateId, g)

                print("filtering finished! for grids of "+stateName)
                    
                # send email
                email("Tile Grid saved for state "+stateName)

    return HttpResponse("Grid creation process started!")

# fetch sub grids
def fetchSubGrid():
     # get all the states
    states = getStates()
    threshold = kmToDeg(50)
    
    for state in states:
        stateId = state.id
        stateName = state.name

        # get tile grid of the state
        tileGridsOfStates = getTileGrid(stateId)
        counter = 0
        # loop over tile grid
        for grid in tileGridsOfStates:
            counter += 1
            bounds = grid.grid
            bbox = nesw(bounds)

            # bounds
            bound = bbox["min"] + bbox["max"]

             # get fish net
            print("creating fishnet for tile = "+ str(grid.id) +", state "+stateName)
            options = {}
            options["logPrefix"] = stateName
            options["log"] = True
            grids = fishnet(bound, threshold, False, options)

            # adding sub grids
            for g in grids:
                addSubGrid(stateId, grid.id, g)

            print("grid creation finished : "+str(counter) + "/" + str(len(tileGridsOfStates))+ " for tile = "+ str(grid.id) +", state "+stateName)

        # send email
        email("Subgrids saved for state "+stateName)

    # return HttpResponse("Creating subgrid process started!")

# fetch streets
def fetchStreets(request):
    # get all the states
    states = getStates()
    
    for state in states:
        stateId = state.id

        tileGridsOfStates = getTileGrid(stateId)
        counter = 0
        # loop over tile grid
        for grid in tileGridsOfStates:
            counter += 1
            bounds = grid.grid
            
            print("street fetching finished : "+str(counter) + "/" + str(len(tileGridsOfStates)))

    return HttpResponse("Street fetching process started!")


# Helper functions #####################
# add state to db
def addState(name, bounds):
    try:
        s = models.States(
            name = name,
            bounds = bounds
        )

        s.save()

        return s.id
    except Exception as e:
        print("db error ", e)

        # send email
        email("Couldn't save state "+name+" because : "+str(e))
        return False

# add tile to db
def addTileGrid(stateId, grid):
    try:
        s = models.TileGrids(
            stateId = models.States.objects.get(id = stateId),
            grid = grid
        )

        s.save()

        return True
    except Exception as e:
        print("db error ", e)

        email("Couldn't save tile for stateId "+str(stateId)+" because : "+str(e))
        return False

# add subgrids
def addSubGrid(stateId, tileGridId, grid):
    try:
        s = models.SubGrids(
            stateId = models.States.objects.get(id = stateId),
            tileGridId = models.TileGrids.objects.get(id = tileGridId),
            bounds = grid
        )

        s.save()

        return True
    except Exception as e:
        print("db error ", e)

        # email("Couldn't save tile for stateId "+str(stateId)+" because : "+str(e))
        return False
    return

def getStates():
    try:
        states = models.States.objects.all()

        return states
    except Exception as e :
        print("db error ", e)

        # email("Couldn't fetch states because : "+str(e))
        return False 

# get tile grid
def getTileGrid(stateId):
    try:
        grids = models.TileGrids.objects.filter(stateId = stateId)

        return grids
    except Exception as e :
        print("db error ", e)
        
        # email("Couldn't fetch tile for stateId "+str(stateId)+" because : "+str(e))
        return False  
    

# Helper function ############################################
def email(message):
    # Create a secure SSL context
    context = ssl.create_default_context()

    # conf
    smtp_server = settings.EMAIL_CONF["smtp_server"]
    port = settings.EMAIL_CONF["port"]
    sender_email = settings.EMAIL_CONF["sender_email"]
    password = settings.EMAIL_CONF["password"]

    # Try to log in to server and send email
    try:
        server = smtplib.SMTP(smtp_server,port)
        server.ehlo() # Can be omitted
        server.starttls(context = context) # Secure the connection
        server.ehlo() # Can be omitted
        server.login(sender_email, password)
        
        # send email
        
        server.sendmail(sender_email, "deep@churchtalk.io", message)
    except Exception as e:
        # Print any error messages to stdout
        print(e)
        return False
    finally:
        server.quit()
        return True
    return    

# is within point
def isWithinBound(o, bounds):
    pt = point(o)
    poly = shapelyPolygon(list(bounds))
    return poly.contains(pt)

# filter the grid
def isGridInBound(grid, bounds):
    gridInBound = False
    for g in grid:
        if isWithinBound(g, bounds):
            gridInBound = True
    
    return gridInBound

# convert points into array format
def convertPoints(data):
    polygon = []

    # parse data
    for point in data:
        arr = [float(point["lng"]), float(point["lat"])]
        
        polygon.append(arr)

    return polygon