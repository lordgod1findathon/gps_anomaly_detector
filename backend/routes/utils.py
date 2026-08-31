import math
import numpy as np
from fastdtw import fastdtw
from scipy.spatial.distance import euclidean

def haversine(lat1, lon1, lat2, lon2):
    """Calculates physical distance between two GPS points in meters."""
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi, dlam = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def calculate_bearing(lat1, lon1, lat2, lon2):
    """Calculates compass direction between points to figure out where a vehicle is pointing."""
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dLon = lon2 - lon1
    x = math.sin(dLon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1) * math.cos(lat2) * math.cos(dLon))
    return (math.degrees(math.atan2(x, y)) + 360) % 360

def extract_turns(points):
    """Translates GPS coordinates into a sequence of left, right, and u-turns."""
    turns = []
    if len(points) < 3: return turns
    for i in range(len(points) - 2):
        b1 = calculate_bearing(points[i]['lat'], points[i]['lng'], points[i+1]['lat'], points[i+1]['lng'])
        b2 = calculate_bearing(points[i+1]['lat'], points[i+1]['lng'], points[i+2]['lat'], points[i+2]['lng'])
        diff = (b2 - b1 + 360) % 360
        
        if 45 <= diff <= 135: turns.append("RIGHT")
        elif 225 <= diff <= 315: turns.append("LEFT")
        elif 135 < diff < 225: turns.append("U-TURN")
    return turns

def evaluate_route_anomaly(base_route, new_trip, spatial_threshold=50):
    """
    The main intelligence engine (Phase 3 & 4). 
    Returns a comprehensive dictionary for the React frontend.
    """
    reasons = []
    flagged_segments = []
    anomaly_score = 0
    
    # 1. Topological Check (Turn Sequence)
    base_turns = extract_turns(base_route)
    new_turns = extract_turns(new_trip)
    if base_turns != new_turns:
        reasons.append("Turn sequence mismatch")
        anomaly_score += 40
        
    # 2. Shape Check (Dynamic Time Warping)
    base_arr = np.array([[pt['lat'], pt['lng']] for pt in base_route])
    new_arr = np.array([[pt['lat'], pt['lng']] for pt in new_trip])
    
    if len(base_arr) > 0 and len(new_arr) > 0:
        distance, path = fastdtw(new_arr, base_arr, dist=euclidean)
        # Scale mathematical distance to a penalty score
        shape_penalty = min(distance * 10000, 60) 
        if shape_penalty > 20:
            reasons.append("Path shape deviation detected")
            anomaly_score += shape_penalty
            
    # 3. Spatial Check (Corridor Breach for UI Highlighting)
    for idx, new_pt in enumerate(new_trip):
        # Find the closest point on the base route to this new point
        min_dist = min([haversine(new_pt['lat'], new_pt['lng'], b['lat'], b['lng']) for b in base_route])
        if min_dist > spatial_threshold:
            flagged_segments.append({
                "index": idx,
                "lat": new_pt['lat'],
                "lng": new_pt['lng'],
                "deviation_meters": round(min_dist, 2)
            })
            
    if len(flagged_segments) > (len(new_trip) * 0.1):
        reasons.append(f"Physical corridor breached at {len(flagged_segments)} points")
        anomaly_score += 30

    # Cap the maximum score at 100
    anomaly_score = min(anomaly_score, 100)
    
    # Generate confidence based on data sample size
    confidence = min((len(base_route) + len(new_trip)) / 20 * 100, 95)

    return {
        "is_anomaly": anomaly_score > 50,
        "anomaly_score": round(anomaly_score, 1),
        "confidence": round(confidence, 1),
        "reasons": reasons,
        "flagged_segments": flagged_segments,
        "turns_expected": base_turns,
        "turns_observed": new_turns
    }
