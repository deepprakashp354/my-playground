from django.contrib.postgres.fields import JSONField
from django.db import models

# states collection
class States(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 200)
    bounds = JSONField()

# tile grid collection
class TileGrids(models.Model):
    id = models.AutoField(primary_key=True)
    stateId = models.ForeignKey(States)
    grid = JSONField()

# street collection
class Streets(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 200)
    tileGridId = models.ForeignKey(TileGrids)
    bounds = JSONField()
    distance = models.IntegerField()
    distanceUnit = models.CharField(max_length = 200)

# subgrid collection
class SubGrids(models.Model):
    id = models.AutoField(primary_key=True)
    tileGridId = models.ForeignKey(TileGrids)
    stateId = models.ForeignKey(States)
    bounds = JSONField()