from django.urls import path
from .views import index
from .views import generate_workout

urlpatterns = [
    path('', index, name='index'),
    path('generate-workout/', generate_workout, name='generate_workout'),
]