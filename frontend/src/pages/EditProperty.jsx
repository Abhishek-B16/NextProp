import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, Upload, AlertCircle, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { getPropertyByIdApi, updatePropertyApi } from '../services/propertyService';
import { PROPERTY_TYPES, PROPERTY_PURPOSES } from '../constants/roles';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AVAILABLE_AMENITIES = [
  'WiFi',
  'Parking',
  'Swimming Pool',
  'Gym',
  'Security',
  'Air Conditioning',
  'Elevator',
  'Garden',
  'Power Backup',
  'Furnished'
];

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    status: 'available',
    amenities: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await getPropertyByIdApi(id);
        if (data && data.data) {
          const prop = data.data;
          setFormData({
            title: prop.title || '',
            description: prop.description || '',
            purpose: prop.purpose || 'Rent',
            propertyType: prop.propertyType || 'Apartment',
            price: prop.price || '',
            address: prop.address || '',
            city: prop.city || '',
            state: prop.state || '',
            pincode: prop.pincode || '',
            bedrooms: prop.bedrooms || '2',
            bathrooms: prop.bathrooms || '2',
            area: prop.area || '',
            status: prop.status || 'available',
            amenities: prop.amenities || []
          });
          setExistingImages(prop.images || []);
        }
      } catch (err) {
        setErrorMessage('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    setIsSubmitting(true);

    try {
      const dataPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'amenities') {
          formData.amenities.forEach((item) => dataPayload.append('amenities', item));
        } else {
          dataPayload.append(key, formData[key]);
        }
      });

      newImageFiles.forEach((file) => {
        dataPayload.append('images', file);
      });

      await updatePropertyApi(id, dataPayload);
      navigate('/dashboard?tab=properties');
    } catch (err) {
      console.error('Property update error:', err);
      setErrorMessage(err.errorMessage || 'Failed to update property listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading property details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Link to="/dashboard?tab=properties" className="text-xs text-slate-400 hover:text-brand-400 flex items-center gap-1 mb-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to My Properties</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-400" />
            <span>Edit Property Listing</span>
          </h1>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Title, Status & Description */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">1. Basic Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Listing Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 cursor-pointer"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending Review</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Purpose, Type & Price */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">2. Type & Pricing</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Purpose *</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 cursor-pointer"
                >
                  {PROPERTY_PURPOSES.map((p) => (
                    <option key={p} value={p}>For {p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80 cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  min="0"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">3. Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500/80"
                />
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">4. Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-500/15 border-brand-500 text-slate-100'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{amenity}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add New Images */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">5. Add Additional Images</h3>
            <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/60 p-4 rounded-2xl text-center bg-slate-900/50">
              <Upload className="w-6 h-6 text-brand-400 mx-auto mb-1" />
              <label className="cursor-pointer text-xs font-bold text-brand-400 hover:text-brand-300">
                <span>Select New Image Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>
            </div>

            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {newImagePreviews.map((preview, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-800">
                    <img src={preview} alt="new preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="gradient-btn w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 mt-6 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Property Listing...</span>
              </>
            ) : (
              <span>Save & Update Listing</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
