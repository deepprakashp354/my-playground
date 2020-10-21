# Create your tasks here
from __future__ import absolute_import, unicode_literals
from celery.utils.log import get_task_logger
from celery import task

from . import views

logger = get_task_logger(__name__)

# @shared_task
# def add(x, y):
#     return x + y


# @shared_task
# def mul(x, y):
#     return x * y


# @shared_task
# def xsum(numbers):
#     return sum(numbers)

@task(ignore_result=True)
def print_hello():

    logger.info('createGrid Process started!')

    views.createGrids()

@task(ignore_result=True)
def fetchSubGrid():

    logger.info('fetch sub grid Process started!')

    views.fetchSubGrid()