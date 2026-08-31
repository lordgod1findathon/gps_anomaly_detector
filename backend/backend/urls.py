from django.urls import path
from . import views

urlpatterns = [
    path('base-route/', views.create_base_route, name='create_base_route'),
    path('evaluate/', views.evaluate_trip, name='evaluate_trip'),
    path('history/<str:route_id>/', views.get_trip_history, name='get_trip_history'),
    path('trips/', views.get_all_trips, name='get_all_trips'), # New Global History
    path('analytics/', views.get_analytics, name='get_analytics'), # New Analytics
]
