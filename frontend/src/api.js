import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000";

const API = axios.create({
    baseURL: API_BASE_URL,
});

// Matches POST /base-route/
export const saveBaseRoute = (data) => API.post('/base-route/', data);

// Matches POST /evaluate/
export const logTrip = (data) => API.post('/evaluate/', data);

// Matches GET /history/<route_id>/
export const getHistory = (routeId) => API.get(`/history/${routeId}/`);

// Matches GET /trips/
export const getAllTrips = () => API.get('/trips/');

// Matches GET /analytics/
export const getAnalytics = () => API.get('/analytics/');