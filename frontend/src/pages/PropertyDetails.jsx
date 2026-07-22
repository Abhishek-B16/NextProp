import React from 'react';
import { useParams } from 'react-router-dom';

export default function PropertyDetails() {
  const { id } = useParams();
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Property Details</h1>
      <p className="text-slate-400 text-sm">Listing ID: {id}</p>
    </div>
  );
}
