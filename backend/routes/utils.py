import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000 # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda / 2.0) ** 2
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def is_anomaly(base_route, new_trip, threshold_meters=50):
    deviated_points = 0
    for new_pt in new_trip:
        min_distance = float('inf')
        for base_pt in base_route:
            dist = haversine(new_pt['lat'], new_pt['lng'], base_pt['lat'], base_pt['lng'])
            if dist < min_distance:
                min_distance = dist
                
        if min_distance > threshold_meters:
            deviated_points += 1

    deviation_ratio = deviated_points / len(new_trip) if len(new_trip) > 0 else 0
    return deviation_ratio > 0.15
