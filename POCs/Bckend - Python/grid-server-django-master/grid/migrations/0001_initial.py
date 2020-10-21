# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2019-05-27 10:44
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='States',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('bounds', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Streets',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
                ('bounds', django.contrib.postgres.fields.jsonb.JSONField()),
                ('distance', models.IntegerField()),
                ('distanceUnit', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='SubGrids',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('bounds', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='TileGrids',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('grid', django.contrib.postgres.fields.jsonb.JSONField()),
                ('stateId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='grid.States')),
            ],
        ),
        migrations.AddField(
            model_name='subgrids',
            name='tileGridId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='grid.TileGrids'),
        ),
        migrations.AddField(
            model_name='streets',
            name='tileGridId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='grid.TileGrids'),
        ),
    ]