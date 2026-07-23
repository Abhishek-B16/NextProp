const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

const CITIES_DATA = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    areas: ['Bandra West', 'Juhu Beach', 'Worli Seaface', 'Powai Hiranandani', 'Lower Parel', 'Thane West', 'Andheri West', 'Malad Mindspace', 'Colaba Causeway', 'Navi Mumbai Vashi']
  },
  {
    city: 'Delhi',
    state: 'Delhi NCR',
    lat: 28.6139,
    lng: 77.2090,
    areas: ['Vasant Vihar', 'Hauz Khas Enclave', 'DLF Cyber City Gurugram', 'Golf Course Road', 'Noida Sector 62', 'Saket District', 'Greater Kailash 2', 'Dwarka Sector 10', 'Janakpuri West', 'Connaught Place']
  },
  {
    city: 'Bangalore',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    areas: ['HSR Layout Sector 1', 'Indiranagar 100ft Road', 'Koramangala 4th Block', 'Whitefield ITPB', 'Electronic City Phase 1', 'Yelahanka New Town', 'JP Nagar 7th Phase', 'MG Road Boulevard', 'Marathahalli Bridge', 'Bannerghatta Road']
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    areas: ['Koregaon Park Lane 7', 'Baner High Street', 'Viman Nagar Near Airport', 'Kharadi EON Free Zone', 'Kothrud Karve Nagar', 'Hinjewadi Phase 1', 'Kalyani Nagar', 'Wakad Dange Chowk', 'Aundh IT Park', 'Magarpatta Cybercity']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    areas: ['HITEC City Cyber Towers', 'Gachibowli Financial District', 'Jubilee Hills Road 36', 'Banjara Hills Road 12', 'Kondapur Main Road', 'Madhapur Near Metro', 'Manikonda Greens', 'Begumpet Airport Zone', 'Kukatpally Housing Board', 'Miyapur Junction']
  },
  {
    city: 'Goa',
    state: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    areas: ['Anjuna Beach Road', 'Calangute Main Strip', 'Panaji Miramar Beach', 'Candolim Fort Road', 'Vagator Cliff Side', 'Baga Creek Lane', 'Porvorim Highway', 'Assagao Heritage Village', 'Morjim Turtle Beach', 'Colva Beach South']
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    areas: ['ECR Kovalam Road', 'Adyar Canal Bank', 'Anna Nagar Shanthi Colony', 'T. Nagar Ranganathan St', 'OMR IT Corridor', 'Velachery Main Road', 'Nungambakkam High Road', 'Besant Nagar Beach', 'Alwarpet TTK Road', 'Mylapore Temple Zone']
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    areas: ['Park Street Crossing', 'Salt Lake Sector 5', 'New Town Action Area 1', 'Alipore Burdwan Road', 'Ballygunge Circular', 'Rajarhat Expressway', 'Kasba EM Bypass', 'Howrah Riverfront', 'Behala Chowrasta', 'Dum Dum Airport']
  }
];

const PROPERTY_TYPES_LIST = ['Apartment', 'House', 'Villa', 'Commercial', 'Plot/Land', 'Studio', 'Other'];
const AMENITIES_POOL = ['WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Security', 'Air Conditioning', 'Elevator', 'Garden', 'Power Backup', 'Furnished', 'Clubhouse', 'Pet Friendly'];

const REAL_ESTATE_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
];

// Generate 10 listings per city (80 total)
const generateSampleProperties = () => {
  const listings = [];
  let imgIndex = 0;

  CITIES_DATA.forEach((cityObj) => {
    cityObj.areas.forEach((areaName, index) => {
      const isRent = index % 2 === 0;
      const type = PROPERTY_TYPES_LIST[index % PROPERTY_TYPES_LIST.length];
      const beds = type === 'Studio' ? 1 : type === 'Penthouse' || type === 'Villa' ? 4 : (index % 3) + 2;
      const baths = Math.max(1, beds);
      const areaSqft = beds * 550 + (index * 120);

      const rentPrice = 25000 + (index * 12000) + (cityObj.city === 'Mumbai' || cityObj.city === 'Delhi' ? 20000 : 0);
      const sellPrice = 6500000 + (index * 4500000) + (cityObj.city === 'Mumbai' ? 15000000 : 0);
      const price = isRent ? rentPrice : sellPrice;

      const img1 = REAL_ESTATE_IMAGES[imgIndex % REAL_ESTATE_IMAGES.length];
      const img2 = REAL_ESTATE_IMAGES[(imgIndex + 1) % REAL_ESTATE_IMAGES.length];
      imgIndex++;

      listings.push({
        title: `${isRent ? 'Premium' : 'Exclusive'} ${beds}BHK ${type} in ${areaName}`,
        description: `Gorgeous, well-ventilated ${beds} BHK ${type.toLowerCase()} located in prime ${areaName}, ${cityObj.city}. Features high-end modern interiors, modular kitchen, dedicated car parking, and 24/7 security. Direct owner listing with zero brokerage fee.`,
        purpose: isRent ? 'Rent' : 'Sell',
        propertyType: type,
        price: price,
        address: areaName,
        city: cityObj.city,
        state: cityObj.state,
        pincode: `400${(index + 10).toString().padStart(3, '0')}`,
        bedrooms: beds,
        bathrooms: baths,
        area: areaSqft,
        amenities: AMENITIES_POOL.slice(0, 5 + (index % 6)),
        images: [
          { url: img1, fileId: `img_${cityObj.city}_${index}_1` },
          { url: img2, fileId: `img_${cityObj.city}_${index}_2` }
        ],
        latitude: cityObj.lat + (index * 0.008),
        longitude: cityObj.lng + (index * 0.008),
        isFeatured: index < 2,
        averageRating: parseFloat((4.3 + (index % 8) * 0.1).toFixed(1)),
        numOfReviews: 4 + (index * 3)
      });
    });
  });

  return listings;
};

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

    const sampleProperties = generateSampleProperties();

    const propertiesToInsert = sampleProperties.map((p) => ({
      ...p,
      owner: owner._id,
      status: 'available'
    }));

    const insertedProperties = await Property.insertMany(propertiesToInsert);
    console.log(`🎉 Successfully seeded ${insertedProperties.length} dynamic property listings (10 per city across 8 major hubs)!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
