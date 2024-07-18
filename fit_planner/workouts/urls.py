from django.urls import path
from .views import index
from .views import generate_workout
from . import views
from .views import workout_plan

urlpatterns = [
    path('', index, name='index'),
    path('preferences/', views.preferences, name='preferences'),
    path('generate-workout/', generate_workout, name='generate_workout'),
    path('workout-plan/', workout_plan, name='workout_plan'),
]