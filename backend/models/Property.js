const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description'],
      trim: true
    },
    purpose: {
      type: String,
      required: [true, 'Please specify property purpose (Rent or Sell)'],
      enum: {
        values: ['Rent', 'Sell'],
        message: 'Purpose must be either Rent or Sell'
      }
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: {
        values: ['Apartment', 'House', 'Villa', 'Commercial', 'Plot/Land', 'Studio', 'Other'],
        message: 'Property type must be Apartment, House, Villa, Commercial, Plot/Land, Studio, or Other'
      }
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price'],
      min: [0, 'Price cannot be negative']
    },
    address: {
      type: String,
      required: [true, 'Please specify the street address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please specify the state'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Please specify the pincode'],
      trim: true
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bedrooms count cannot be negative']
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bathrooms count cannot be negative']
    },
    area: {
      type: Number,
      required: [true, 'Please specify property area (in sq. ft)'],
      min: [0, 'Area cannot be negative']
    },
    amenities: {
      type: [String],
      default: []
    },
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true }
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Property must belong to an owner']
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'rented', 'sold', 'pending'],
        message: 'Status must be available, rented, sold, or pending'
      },
      default: 'available'
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    numOfReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

// Optimized Indexes for Fast Multi-Criteria Search & Sorting
propertySchema.index(
  {
    title: 'text',
    description: 'text',
    city: 'text',
    state: 'text',
    address: 'text'
  },
  {
    name: 'PropertyTextSearchIndex',
    weights: { title: 5, city: 3, state: 3, address: 2, description: 1 }
  }
);

propertySchema.index({ purpose: 1, propertyType: 1, city: 1, state: 1, price: 1, status: 1 });
propertySchema.index({ bedrooms: 1, bathrooms: 1, price: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ price: 1 });
propertySchema.index({ price: -1 });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
