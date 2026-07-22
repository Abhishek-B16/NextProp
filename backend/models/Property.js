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
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient search & filtering
propertySchema.index({ city: 1, purpose: 1, propertyType: 1, price: 1, status: 1 });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
