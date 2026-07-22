import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Bed, Bath, Maximize2, ExternalLink } from 'lucide-react';
import { formatPrice, getImageUrl } from '../../utils/formatters';

// Fix Leaflet Default Icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export default function PropertiesMapView({ properties = [] }) {
  // Filter properties with valid lat & lng coordinates
  const validProps = properties.filter((p) => p.latitude && p.longitude);

  // Default Center (India geographical center or first property)
  const defaultLat = validProps.length > 0 ? validProps[0].latitude : 20.5937;
  const defaultLng = validProps.length > 0 ? validProps[0].longitude : 78.9629;

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 h-[650px] shadow-2xl relative">
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={validProps.length === 1 ? 12 : 5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validProps.map((prop) => {
          const imgUrl = getImageUrl(prop.images?.[0]);

          return (
            <Marker key={prop._id} position={[prop.latitude, prop.longitude]}>
              <Popup className="custom-leaflet-popup">
                <div className="w-64 p-1 space-y-2 text-slate-900">
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={imgUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600">
                        For {prop.purpose} &bull; {prop.propertyType}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                      {prop.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-brand-500 flex-shrink-0" />
                      <span>{prop.city}, {prop.state}</span>
                    </p>

                    <div className="text-sm font-black text-slate-900 pt-1">
                      {formatPrice(prop.price)}
                      {prop.purpose === 'Rent' && <span className="text-[10px] font-normal text-slate-500"> /mo</span>}
                    </div>

                    <Link
                      to={`/properties/${prop._id}`}
                      className="mt-2 w-full py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold text-center flex items-center justify-center gap-1 hover:bg-brand-600 transition-colors"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
