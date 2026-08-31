import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Matches POST /base-route/
export const saveBaseRoute = (data) => API.post('/base-route/', data);

// Matches POST /evaluate/
export const logTrip = (data) => API.post('/evaluate/', data);

// Matches GET /history/<route_id>/
export const getHistory = (routeId) => API.get(`/history/${routeId}/`);