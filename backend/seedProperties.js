const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

const sampleProperties = [
  {
    title: 'Luxury 3BHK Sea-Facing Apartment',
    description: 'Stunning 3 bedroom apartment overlooking the Arabian Sea in Bandra West. Features Italian marble flooring, floor-to-ceiling glass windows, modular kitchen, and smart home automation.',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: 185000,
    address: 'Carter Road, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Elevator', 'Air Conditioning', 'WiFi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', fileId: 'img_1' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', fileId: 'img_2' }
    ],
    latitude: 19.0596,
    longitude: 72.8295,
    isFeatured: true,
    averageRating: 4.9,
    numOfReviews: 12
  },
  {
    title: 'Modern 2BHK Smart Home in HSR Layout',
    description: 'Brand new 2 BHK apartment near tech parks in HSR Layout, Bengaluru. Fully furnished with high-end appliances, covered car parking, and 24/7 power backup.',
    purpose: 'Rent',
    propertyType: 'Apartment',
    price: 45000,
    address: 'Sector 2, HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560102',
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    amenities: ['Parking', 'Gym', 'Security', 'Power Backup', 'Elevator', 'WiFi', 'Clubhouse'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', fileId: 'img_3' }
    ],
    latitude: 12.9121,
    longitude: 77.6446,
    isFeatured: true,
    averageRating: 4.7,
    numOfReviews: 8
  },
  {
    title: 'Exclusive Beachside Villa in Anjuna',
    description: 'Private 4 BHK luxury villa with private plunge pool and garden in Anjuna, Goa. Perfect investment property for holiday home or rental yield.',
    purpose: 'Sell',
    propertyType: 'Villa',
    price: 32000000,
    address: 'Near Anjuna Flea Market',
    city: 'Goa',
    state: 'Goa',
    pincode: '403509',
    bedrooms: 4,
    bathrooms: 4,
    area: 3800,
    amenities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Air Conditioning', 'WiFi', 'Balcony'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', fileId: 'img_4' }
    ],
    latitude: 15.5847,
    longitude: 73.7423,
    isFeatured: true,
    averageRating: 5.0,
    numOfReviews: 15
  },
  {
    title: 'Premium Corporate Office Space in Cyber City',
    description: 'Fully fitted Grade-A commercial office space in DLF Cyber City, Gurugram. Accommodates up to 50 workstations, 2 conference rooms, and private cafeteria.',
    purpose: 'Rent',
    propertyType: 'Commercial',
    price: 350000,
    address: 'DLF Phase 2, Cyber City',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    bedrooms: 0,
    bathrooms: 4,
    area: 4500,
    amenities: ['Parking', 'Security', 'Power Backup', 'Elevator', 'Air Conditioning', 'WiFi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', fileId: 'img_5' }
    ],
    latitude: 28.495,
    longitude: 77.0895,
    isFeatured: false,
    averageRating: 4.6,
    numOfReviews: 6
  },
  {
    title: 'Spacious Independent House in Koregaon Park',
    description: 'Charming 3 BHK independent bungalow surrounded by greenery in Koregaon Park, Pune. Large lawn, covered garage, and peaceful residential neighborhood.',
    purpose: 'Sell',
    propertyType: 'House',
    price: 24500000,
    address: 'Lane 7, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    amenities: ['Garden', 'Parking', 'Security', 'Power Backup', 'Pet Friendly', 'Balcony'],
    images: [
      { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', fileId: 'img_6' }
    ],
    latitude: 18.5362,
    longitude: 73.894,
    isFeatured: true,
    averageRating: 4.8,
    numOfReviews: 10
  },
  {
    title: 'Cozy Studio Apartment near HITEC City',
    description: 'Compact and elegant studio apartment ideal for IT professionals. Fully furnished with kitchen, high-speed fiber internet, and gym access.',
    purpose: 'Rent',
    propertyType: 'Studio',
    price: 28000,
    address: 'Madhapur, HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    amenities: ['Parking', 'Gym', 'Security', 'Elevator', 'WiFi', 'Air Conditioning'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', fileId: 'img_7' }
    ],
    latitude: 17.4486,
    longitude: 78.3808,
    isFeatured: false,
    averageRating: 4.5,
    numOfReviews: 5
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🌱 Connected to MongoDB Atlas for seeding...');

    // 1. Create or Find Verified Owner User
    let owner = await User.findOne({ email: 'owner@nextprop.in' });
    if (!owner) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      owner = await User.create({
        name: 'Rahul Sharma',
        email: 'owner@nextprop.in',
        password: hashedPassword,
        role: 'owner',
        phone: '+91 9876543210',
        isVerifiedOwner: true
      });
      console.log('✅ Created Verified Owner user: owner@nextprop.in / password123');
    }

    // 2. Clear existing properties and seed new ones
    await Property.deleteMany({});
    console.log('🧹 Purged existing properties.');

    const propertiesToInsert = sampleProperties.map((p) => ({
      ...p,
      owner: owner._id,
      status: 'available'
    }));

    const insertedProperties = await Property.insertMany(propertiesToInsert);
    console.log(`🎉 Successfully seeded ${insertedProperties.length} dynamic property listings!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
