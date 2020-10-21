from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^create/$', views.createGrids, name='createGrids'),
    url(r'^fetchStreets/$', views.fetchStreets, name = 'fetchStreets'),
    url(r'^fetchSubGrid/$', views.fetchSubGrid, name = 'fetchSubGrid')
]