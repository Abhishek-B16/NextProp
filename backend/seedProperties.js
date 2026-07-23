const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');
const Property = require('./models/Property');

dotenv.config();

const DEMO_OWNERS = [
  {
    name: 'Rahul Patil',
    email: 'rahul@nextprop.in',
    phone: '+91 98230 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerifiedOwner: true,
    bio: 'Premier Real Estate Investor & Property Owner across Pune, Goa, and Mumbai.'
  },
  {
    name: 'Sneha Joshi',
    email: 'sneha@nextprop.in',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    isVerifiedOwner: true,
    bio: 'Luxury Villa Specialist and Eco-Homestay Host in Pune & Lonavala.'
  },
  {
    name: 'Amit Shah',
    email: 'amit@nextprop.in',
    phone: '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isVerifiedOwner: true,
    bio: 'Commercial Developer & Penthouse Owner in Mumbai & Pune financial hubs.'
  },
  {
    name: 'Priya Kulkarni',
    email: 'priya@nextprop.in',
    phone: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    isVerifiedOwner: true,
    bio: 'Tech Park Apartment Host & Plot Owner in Bangalore and Kolhapur.'
  }
];

const REAL_ESTATE_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🌱 Connected to MongoDB Atlas for seeding...');

    // 1. Create or Find Verified Demo Owner Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const ownerDocs = [];

    for (const ownerData of DEMO_OWNERS) {
      let owner = await User.findOne({ email: ownerData.email });
      if (!owner) {
        owner = await User.create({
          ...ownerData,
          password: hashedPassword,
          role: 'owner'
        });
        console.log(`✅ Created Demo Owner: ${owner.name} (${owner.email})`);
      } else {
        owner.name = ownerData.name;
        owner.avatar = ownerData.avatar;
        owner.phone = ownerData.phone;
        owner.isVerifiedOwner = true;
        await owner.save();
      }
      ownerDocs.push(owner);
    }

    const [rahul, sneha, amit, priya] = ownerDocs;

    // 2. Clear existing properties and seed SPECIFIED properties per owner
    await Property.deleteMany({});
    console.log('🧹 Purged existing properties.');

    const sampleListings = [
      // RAHUL PATIL (Pune, Goa, Mumbai)
      {
        owner: rahul._id,
        title: 'Modern 2 BHK Apartment in Koregaon Park',
        description: 'Spacious 2 BHK apartment in prime Koregaon Park, Pune. Fully furnished with modular kitchen, Italian marble flooring, 2 balconies, and covered car parking.',
        purpose: 'Rent',
        propertyType: 'Apartment',
        price: 42000,
        address: 'Lane 7, Koregaon Park',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Air Conditioning', 'Elevator', 'Power Backup'],
        images: [
          { url: REAL_ESTATE_IMAGES[0], fileId: 'rahul_1_1' },
          { url: REAL_ESTATE_IMAGES[1], fileId: 'rahul_1_2' }
        ],
        latitude: 18.5362,
        longitude: 73.8940,
        isFeatured: true,
        averageRating: 4.9,
        numOfReviews: 14
      },
      {
        owner: rahul._id,
        title: 'Luxury 4 BHK Beachfront Villa in Anjuna',
        description: 'Private 4 BHK beach villa with private plunge pool and garden in Anjuna, Goa. Perfect luxury holiday home with direct ocean views.',
        purpose: 'Sell',
        propertyType: 'Villa',
        price: 34000000,
        address: 'Anjuna Beach Road',
        city: 'Goa',
        state: 'Goa',
        pincode: '403509',
        bedrooms: 4,
        bathrooms: 4,
        area: 3800,
        amenities: ['Swimming Pool', 'Garden', 'Security', 'Air Conditioning', 'WiFi', 'Parking'],
        images: [
          { url: REAL_ESTATE_IMAGES[3], fileId: 'rahul_2_1' }
        ],
        latitude: 15.5847,
        longitude: 73.7423,
        isFeatured: true,
        averageRating: 5.0,
        numOfReviews: 18
      },
      {
        owner: rahul._id,
        title: 'Sea-Facing 3 BHK Apartment in Bandra West',
        description: 'Stunning 3 BHK sea-facing apartment overlooking Carter Road, Bandra West, Mumbai. Features smart home automation, gym, and 24/7 security.',
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
        amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'WiFi'],
        images: [
          { url: REAL_ESTATE_IMAGES[1], fileId: 'rahul_3_1' }
        ],
        latitude: 19.0596,
        longitude: 72.8295,
        isFeatured: true,
        averageRating: 4.8,
        numOfReviews: 11
      },

      // SNEHA JOSHI (Lonavala, Pune)
      {
        owner: sneha._id,
        title: 'Scenic Farm House Retreat in Lonavala',
        description: 'Peaceful 3 BHK private farm house surrounded by lush hills in Lonavala. Features organic garden, gazebo, lawn, and mountain views.',
        purpose: 'Sell',
        propertyType: 'House',
        price: 21500000,
        address: 'Tungarli Road, Lonavala',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '410401',
        bedrooms: 3,
        bathrooms: 3,
        area: 4500,
        amenities: ['Garden', 'Parking', 'Security', 'Pet Friendly', 'Power Backup'],
        images: [
          { url: REAL_ESTATE_IMAGES[5], fileId: 'sneha_1_1' }
        ],
        latitude: 18.7557,
        longitude: 73.4091,
        isFeatured: true,
        averageRating: 4.9,
        numOfReviews: 15
      },
      {
        owner: sneha._id,
        title: 'Exclusive 5 BHK Luxury Villa in Baner',
        description: 'Architecturally designed 5 BHK luxury villa in Baner, Pune. Private infinity pool, private terrace garden, solar power backup, and double height living space.',
        purpose: 'Sell',
        propertyType: 'Villa',
        price: 48000000,
        address: 'Baner High Street Hilltop',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411045',
        bedrooms: 5,
        bathrooms: 5,
        area: 5200,
        amenities: ['Swimming Pool', 'Garden', 'Clubhouse', 'Gym', 'Security', 'Power Backup'],
        images: [
          { url: REAL_ESTATE_IMAGES[2], fileId: 'sneha_2_1' }
        ],
        latitude: 18.5590,
        longitude: 73.7868,
        isFeatured: true,
        averageRating: 5.0,
        numOfReviews: 20
      },

      // AMIT SHAH (Mumbai, Pune)
      {
        owner: amit._id,
        title: 'Grade-A Commercial Office in BKC Mumbai',
        description: 'Fully furnished commercial office space in Bandra Kurla Complex (BKC), Mumbai. Accommodates 45 workstations, 2 conference rooms, cafeteria, and basement parking.',
        purpose: 'Rent',
        propertyType: 'Commercial',
        price: 320000,
        address: 'G Block, BKC, Bandra East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400051',
        bedrooms: 0,
        bathrooms: 4,
        area: 3800,
        amenities: ['Parking', 'Security', 'Power Backup', 'Elevator', 'Air Conditioning', 'WiFi'],
        images: [
          { url: REAL_ESTATE_IMAGES[4], fileId: 'amit_1_1' }
        ],
        latitude: 19.0657,
        longitude: 72.8687,
        isFeatured: false,
        averageRating: 4.7,
        numOfReviews: 9
      },
      {
        owner: amit._id,
        title: 'Duplex Penthouse in Viman Nagar',
        description: 'Ultra-luxurious 4 BHK duplex penthouse in Viman Nagar, Pune. Private sky deck, jacuzzi, 360-degree skyline views, and private elevator access.',
        purpose: 'Sell',
        propertyType: 'Apartment',
        price: 39000000,
        address: 'Behind Phoenix Marketcity, Viman Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411014',
        bedrooms: 4,
        bathrooms: 4,
        area: 3400,
        amenities: ['Swimming Pool', 'Gym', 'Security', 'Elevator', 'Air Conditioning', 'Clubhouse'],
        images: [
          { url: REAL_ESTATE_IMAGES[0], fileId: 'amit_2_1' }
        ],
        latitude: 18.5679,
        longitude: 73.9143,
        isFeatured: true,
        averageRating: 4.9,
        numOfReviews: 12
      },

      // PRIYA KULKARNI (Kolhapur, Bangalore, Hyderabad, Delhi)
      {
        owner: priya._id,
        title: 'Residential NA Plot in Tarabai Park',
        description: 'Clear title, prime NA residential plot of 4,000 sq ft in Tarabai Park, Kolhapur. Gated community layout with wide internal tar roads, water connection, and electricity.',
        purpose: 'Sell',
        propertyType: 'Plot/Land',
        price: 9500000,
        address: 'Main Road, Tarabai Park',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '416003',
        bedrooms: 0,
        bathrooms: 0,
        area: 4000,
        amenities: ['Security', 'Garden'],
        images: [
          { url: REAL_ESTATE_IMAGES[5], fileId: 'priya_1_1' }
        ],
        latitude: 16.7050,
        longitude: 74.2433,
        isFeatured: false,
        averageRating: 4.6,
        numOfReviews: 7
      },
      {
        owner: priya._id,
        title: 'Modern 3 BHK Smart Apartment in HSR Layout',
        description: 'Brand new 3 BHK smart home near tech parks in HSR Layout, Bangalore. Fully furnished with high-end appliances, covered car parking, clubhouse, and 24/7 power backup.',
        purpose: 'Rent',
        propertyType: 'Apartment',
        price: 55000,
        address: 'Sector 2, HSR Layout',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560102',
        bedrooms: 3,
        bathrooms: 3,
        area: 1650,
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Elevator', 'Clubhouse', 'Power Backup'],
        images: [
          { url: REAL_ESTATE_IMAGES[2], fileId: 'priya_2_1' }
        ],
        latitude: 12.9121,
        longitude: 77.6446,
        isFeatured: true,
        averageRating: 4.8,
        numOfReviews: 16
      },
      {
        owner: priya._id,
        title: 'Elegant Studio Apartment in HITEC City',
        description: 'Sleek 1 BHK studio apartment adjacent to IT parks in HITEC City, Hyderabad. Fully air-conditioned with fiber WiFi, gym, and 24/7 concierge.',
        purpose: 'Rent',
        propertyType: 'Studio',
        price: 32000,
        address: 'Madhapur, HITEC City',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        bedrooms: 1,
        bathrooms: 1,
        area: 750,
        amenities: ['WiFi', 'Parking', 'Gym', 'Security', 'Air Conditioning', 'Elevator'],
        images: [
          { url: REAL_ESTATE_IMAGES[6], fileId: 'priya_3_1' }
        ],
        latitude: 17.4486,
        longitude: 78.3808,
        isFeatured: false,
        averageRating: 4.7,
        numOfReviews: 8
      },
      {
        owner: priya._id,
        title: 'Luxury 3 BHK Villa in Vasant Vihar',
        description: 'Prestigious 3 BHK villa with private lawn in Vasant Vihar, Delhi NCR. Prime embassy diplomatic zone location with top-tier security.',
        purpose: 'Sell',
        propertyType: 'Villa',
        price: 65000000,
        address: 'Block C, Vasant Vihar',
        city: 'Delhi',
        state: 'Delhi NCR',
        pincode: '110057',
        bedrooms: 3,
        bathrooms: 3,
        area: 3600,
        amenities: ['Garden', 'Parking', 'Security', 'Air Conditioning', 'Power Backup'],
        images: [
          { url: REAL_ESTATE_IMAGES[7], fileId: 'priya_4_1' }
        ],
        latitude: 28.5562,
        longitude: 77.1610,
        isFeatured: true,
        averageRating: 4.9,
        numOfReviews: 13
      }
    ];

    const inserted = await Property.insertMany(sampleListings);
    console.log(`🎉 Successfully seeded ${inserted.length} properties across 4 demo owners!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
