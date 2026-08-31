import React, { useState } from 'react';
import { saveBaseRoute } from '../api';

export default function RouteManager() {
    const [name, setName] = useState('');
    const [coordsJSON, setCoordsJSON] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const coordinates = JSON.parse(coordsJSON);
            await saveBaseRoute({ name, coordinates });
            alert('Base route saved');
        } catch (error) {
            console.error(error);
            alert('Invalid JSON or server error');
        }
    };

    return (
        <div style={{border: '1px solid #ccc', padding: '15px', borderRadius: '8px'}}>
            <h2>Establish Normal Route</h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <input 
                    type="text" 
                    placeholder="Route Name (e.g. Daily Commute)" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    style={{padding: '8px'}}
                />
                <textarea 
                    placeholder='[{"lat": 40.7128, "lng": -74.0060}, ...]'
                    value={coordsJSON}
                    onChange={(e) => setCoordsJSON(e.target.value)}
                    style={{padding: '8px', height: '100px'}}
                />
                <button type="submit" style={{padding: '10px', cursor: 'pointer'}}>Save Route</button>
            </form>
        </div>
    );
}
