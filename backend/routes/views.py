from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from pymongo import MongoClient
from .utils import is_anomaly
import datetime

client = MongoClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]

@api_view(['POST'])
def save_base_route(request):
    route_name = request.data.get('name')
    coordinates = request.data.get('coordinates')
    
    route_data = {
        "name": route_name,
        "coordinates": coordinates,
        "created_at": datetime.datetime.utcnow()
    }
    
    result = db.base_routes.insert_one(route_data)
    return Response({"status": "success", "id": str(result.inserted_id)})

@api_view(['POST'])
def log_trip(request):
    route_name = request.data.get('base_route_name')
    trip_coords = request.data.get('coordinates')
    
    base_route = db.base_routes.find_one({"name": route_name})
    if not base_route:
        return Response({"error": "Base route not found"}, status=404)
        
    anomaly_flag = is_anomaly(base_route['coordinates'], trip_coords)
    
    trip_data = {
        "base_route_name": route_name,
        "coordinates": trip_coords,
        "is_anomaly": anomaly_flag,
        "logged_at": datetime.datetime.utcnow()
    }
    
    db.trips.insert_one(trip_data)
    return Response({"status": "success", "anomaly_detected": anomaly_flag})

@api_view(['GET'])
def get_dashboard_data(request):
    trips = list(db.trips.find({}, {'_id': 0}).sort("logged_at", -1))
    return Response({"recent_trips": trips})
