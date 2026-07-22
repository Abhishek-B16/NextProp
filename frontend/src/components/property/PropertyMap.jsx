import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CITY_COORDINATES = {
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
  bangalore: [12.9716, 77.5946],
  pune: [18.5204, 73.8567],
  hyderabad: [17.3850, 78.4867],
  goa: [15.2993, 74.1240],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  ahmedabad: [23.0225, 72.5714]
};

export default function PropertyMap({ city = '', state = '', address = '', title = 'Property Location' }) {
  const cityKey = city.toLowerCase().trim();
  const position = CITY_COORDINATES[cityKey] || [19.0760, 72.8777];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100">Location & Neighborhood</h3>
        <span className="text-xs text-slate-400 font-medium">
          {address ? `${address}, ` : ''}{city}{state ? `, ${state}` : ''}
        </span>
      </div>

      <div className="h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-800 relative z-0">
        <MapContainer
          center={position}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-slate-900 font-bold text-xs">
                {title}
                <div className="text-[10px] font-normal text-slate-600">{city}, {state}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
