from rest_framework.decorators import api_view
from rest_framework.response import Response
from .db import db
from .utils import evaluate_route_anomaly

@api_view(['POST'])
def create_base_route(request):
    data = request.data
    if not data.get('route_id') or not data.get('points'):
        return Response({"error": "Missing route_id or points in payload"}, status=400)
    
    # Save or update the baseline route in MongoDB
    db.base_routes.update_one(
        {"route_id": data["route_id"]},
        {"$set": {"points": data["points"]}},
        upsert=True
    )
    return Response({"message": f"Base route '{data['route_id']}' saved successfully."})

@api_view(['POST'])
def evaluate_trip(request):
    data = request.data
    route_id = data.get('route_id')
    new_trip = data.get('trip_points')
    
    if not route_id or not new_trip:
        return Response({"error": "Missing route_id or trip_points"}, status=400)
        
    # Fetch the established baseline from MongoDB
    base_route_doc = db.base_routes.find_one({"route_id": route_id})
    if not base_route_doc:
        return Response({"error": f"Base route '{route_id}' not found."}, status=404)
        
    # Run the advanced anomaly engine
    base_points = base_route_doc["points"]
    analysis_result = evaluate_route_anomaly(base_points, new_trip, spatial_threshold=50)
    
    # Log the evaluated trip in MongoDB for history/visualization
    log_entry = {
        "route_id": route_id,
        "trip_points": new_trip,
        "analysis": analysis_result
    }
    db.trip_logs.insert_one(log_entry)
    
    # Construct the final payload for React
    response_payload = {
        "route_id": route_id,
        "message": "Trip evaluated successfully."
    }
    # Merge the analysis dictionary into the response
    response_payload.update(analysis_result)
    
    return Response(response_payload)
@api_view(['GET'])
def get_trip_history(request, route_id):
    # Fetch the 10 most recent logs for this route, excluding the internal MongoDB ObjectId
    logs = list(db.trip_logs.find({"route_id": route_id}, {"_id": 0}).sort("_id", -1).limit(10))
    
    if not logs:
        return Response({"message": "No history found for this route."}, status=404)
        
    return Response({
        "route_id": route_id,
        "total_trips": len(logs),
        "history": logs
    })
