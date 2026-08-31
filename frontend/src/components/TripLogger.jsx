import React, { useState } from 'react';
import { logTrip } from '../api';

export default function TripLogger() {
    const [routeName, setRouteName] = useState('');
    const [coordsJSON, setCoordsJSON] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const coordinates = JSON.parse(coordsJSON);
            const response = await logTrip({ base_route_name: routeName, coordinates });
            setResult(response.data);
        } catch (error) {
            console.error(error);
            alert('Invalid JSON or server error');
        }
    };

    return (
        <div style={{border: '1px solid #ccc', padding: '15px', borderRadius: '8px'}}>
            <h2>Log New Trip</h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <input 
                    type="text" 
                    placeholder="Target Base Route Name" 
                    value={routeName} 
                    onChange={(e) => setRouteName(e.target.value)}
                    style={{padding: '8px'}} 
                />
                <textarea 
                    placeholder='Paste GPS trace JSON here...'
                    value={coordsJSON}
                    onChange={(e) => setCoordsJSON(e.target.value)}
                    style={{padding: '8px', height: '100px'}}
                />
                <button type="submit" style={{padding: '10px', cursor: 'pointer'}}>Analyze Trip</button>
            </form>
            
            {result && (
                <div style={{marginTop: '15px', padding: '10px', background: '#f5f5f5'}}>
                    {result.anomaly_detected ? (
                        <h3 style={{color: 'red', margin: 0}}>🔴 Deviation Detected!</h3>
                    ) : (
                        <h3 style={{color: 'green', margin: 0}}>🟢 Trip matches normal pattern.</h3>
                    )}
                </div>
            )}
        </div>
    );
}
