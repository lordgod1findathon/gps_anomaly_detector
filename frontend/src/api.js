import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export const saveBaseRoute = (data) => API.post('base-route/', data);
export const logTrip = (data) => API.post('log-trip/', data);
export const fetchDashboard = () => API.get('dashboard/');
