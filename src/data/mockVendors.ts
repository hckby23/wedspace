// Mock vendor data for testing

export interface MockVendor {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  country: string;
  price_range: string;
  rating: number;
  review_count: number;
  verified: boolean;
  status: 'active' | 'inactive';
  response_time_hours: number;
  portfolio_images: string[];
  services_offered: string[];
  cancellation_policy: string;
  images: string[];
  contact_email: string;
  contact_phone: string;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export const MOCK_VENDORS: MockVendor[] = [
  {
    id: 'v1',
    owner_id: 'owner-1',
    name: 'Elegant Photography',
    category: 'Photography',
    description: 'Professional wedding photography with cinematic style. Capturing your special moments with artistic vision and technical excellence.',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    price_range: '₹75,000 - ₹1,50,000',
    rating: 4.9,
    review_count: 156,
    verified: true,
    status: 'active',
    response_time_hours: 2,
    portfolio_images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800'
    ],
    services_offered: ['Wedding Photography', 'Pre-wedding Shoot', 'Candid Photography', 'Drone Coverage', 'Album Design'],
    cancellation_policy: 'Full refund if cancelled 30 days before event',
    images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800'],
    contact_email: 'info@elegantphotography.com',
    contact_phone: '+91 98765 43210',
    website: 'https://elegantphotography.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v7',
    owner_id: 'owner-7',
    name: 'Moments Photography Studio',
    category: 'Photography',
    description: 'Award-winning photography team specializing in candid moments and traditional portraits.',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    price_range: '₹90,000 - ₹2,00,000',
    rating: 4.8,
    review_count: 203,
    verified: true,
    status: 'active',
    response_time_hours: 1,
    portfolio_images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800'
    ],
    services_offered: ['Candid Photography', 'Traditional Photography', 'Pre-wedding', 'Destination Wedding', 'Photo Albums'],
    cancellation_policy: 'Full refund if cancelled 45 days before event',
    images: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800'],
    contact_email: 'hello@momentsstudio.in',
    contact_phone: '+91 98765 43216',
    website: 'https://momentsstudio.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v8',
    owner_id: 'owner-8',
    name: 'Lens & Light Photography',
    category: 'Photography',
    description: 'Contemporary wedding photography with a focus on storytelling and emotions.',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    price_range: '₹60,000 - ₹1,20,000',
    rating: 4.7,
    review_count: 145,
    verified: true,
    status: 'active',
    response_time_hours: 3,
    portfolio_images: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800'
    ],
    services_offered: ['Wedding Photography', 'Engagement Shoot', 'Candid', 'Cinematic Videos'],
    cancellation_policy: '50% refund if cancelled 20 days before event',
    images: ['https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800'],
    contact_email: 'info@lensandlight.com',
    contact_phone: '+91 98765 43217',
    website: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v2',
    owner_id: 'owner-2',
    name: 'Dream Decorators',
    category: 'Decoration',
    description: 'Creative event decoration and design services. Transforming venues into magical spaces with innovative themes and stunning setups.',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    price_range: '₹85,000 - ₹2,00,000',
    rating: 4.7,
    review_count: 203,
    verified: true,
    status: 'active',
    response_time_hours: 3,
    portfolio_images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'
    ],
    services_offered: ['Stage Decoration', 'Floral Arrangements', 'Lighting Design', 'Theme Decor', 'Entrance Setup'],
    cancellation_policy: '50% refund if cancelled 15 days before event',
    images: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'],
    contact_email: 'hello@dreamdecorators.in',
    contact_phone: '+91 98765 43211',
    website: 'https://dreamdecorators.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v3',
    owner_id: 'owner-3',
    name: 'Royal Caterers',
    category: 'Catering',
    description: 'Premium catering services with diverse cuisine options. Expert chefs crafting delicious menus for your special celebration.',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    price_range: '₹800 - ₹2,000 per plate',
    rating: 4.8,
    review_count: 189,
    verified: true,
    status: 'active',
    response_time_hours: 4,
    portfolio_images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
    ],
    services_offered: ['Multi-Cuisine Menu', 'Live Counters', 'Dessert Stations', 'Beverage Service', 'Custom Menus'],
    cancellation_policy: 'No refund if cancelled within 7 days of event',
    images: ['https://images.unsplash.com/photo-1555244162-803834f70033?w=800'],
    contact_email: 'bookings@royalcaterers.com',
    contact_phone: '+91 98765 43212',
    website: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v4',
    owner_id: 'owner-4',
    name: 'Melody Music & DJ',
    category: 'Entertainment',
    description: 'Professional DJ and live music services. Creating the perfect ambiance with curated playlists and live performances.',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    price_range: '₹60,000 - ₹1,20,000',
    rating: 4.6,
    review_count: 142,
    verified: true,
    status: 'active',
    response_time_hours: 5,
    portfolio_images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'
    ],
    services_offered: ['DJ Services', 'Live Band', 'Sound System', 'Lighting Effects', 'Emcee Services'],
    cancellation_policy: 'Full refund if cancelled 20 days before event',
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
    contact_email: 'info@melodymusic.in',
    contact_phone: '+91 98765 43213',
    website: 'https://melodymusic.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v5',
    owner_id: 'owner-5',
    name: 'Glamour Makeup Studio',
    category: 'Makeup & Hair',
    description: 'Bridal makeup and hair styling experts. Making you look stunning on your special day with professional artistry.',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    price_range: '₹40,000 - ₹80,000',
    rating: 4.9,
    review_count: 178,
    verified: true,
    status: 'active',
    response_time_hours: 2,
    portfolio_images: [
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
      'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'
    ],
    services_offered: ['Bridal Makeup', 'Hair Styling', 'Saree Draping', 'Trial Session', 'Family Makeup'],
    cancellation_policy: '75% refund if cancelled 10 days before event',
    images: ['https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800'],
    contact_email: 'bookings@glamourstudio.com',
    contact_phone: '+91 98765 43214',
    website: 'https://glamourstudio.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v6',
    owner_id: 'owner-6',
    name: 'Cinematic Films',
    category: 'Videography',
    description: 'Wedding cinematography and video production. Creating beautiful wedding films that tell your love story.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    price_range: '₹90,000 - ₹1,80,000',
    rating: 4.8,
    review_count: 134,
    verified: true,
    status: 'active',
    response_time_hours: 3,
    portfolio_images: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'
    ],
    services_offered: ['Wedding Film', 'Highlight Video', 'Drone Videography', 'Same Day Edit', 'Documentary Style'],
    cancellation_policy: 'Full refund if cancelled 25 days before event',
    images: ['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800'],
    contact_email: 'contact@cinematicfilms.in',
    contact_phone: '+91 98765 43215',
    website: 'https://cinematicfilms.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v9',
    owner_id: 'owner-9',
    name: 'Floral Dreams',
    category: 'Decoration',
    description: 'Luxury floral decoration and event styling. Creating breathtaking floral arrangements for your special day.',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    price_range: '₹1,00,000 - ₹3,00,000',
    rating: 4.8,
    review_count: 167,
    verified: true,
    status: 'active',
    response_time_hours: 2,
    portfolio_images: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'
    ],
    services_offered: ['Floral Decoration', 'Stage Setup', 'Mandap Decoration', 'Table Arrangements', 'Entrance Decor'],
    cancellation_policy: '50% refund if cancelled 30 days before event',
    images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'],
    contact_email: 'info@floraldreams.in',
    contact_phone: '+91 98765 43218',
    website: 'https://floraldreams.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v10',
    owner_id: 'owner-10',
    name: 'Spice Route Caterers',
    category: 'Catering',
    description: 'Premium catering with authentic Indian and international cuisines. Farm-to-table freshness guaranteed.',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    price_range: '₹1,200 - ₹2,500 per plate',
    rating: 4.7,
    review_count: 234,
    verified: true,
    status: 'active',
    response_time_hours: 3,
    portfolio_images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
    ],
    services_offered: ['Multi-Cuisine', 'Live Counters', 'Dessert Bar', 'Custom Menus', 'Vegan Options'],
    cancellation_policy: 'No refund if cancelled within 10 days',
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
    contact_email: 'bookings@spiceroute.com',
    contact_phone: '+91 98765 43219',
    website: 'https://spiceroute.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v11',
    owner_id: 'owner-11',
    name: 'Beats & Rhythm DJ',
    category: 'Entertainment',
    description: 'Professional DJ services with state-of-the-art sound and lighting. Making your celebration unforgettable.',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    price_range: '₹50,000 - ₹1,00,000',
    rating: 4.6,
    review_count: 198,
    verified: true,
    status: 'active',
    response_time_hours: 4,
    portfolio_images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    ],
    services_offered: ['DJ Services', 'Sound System', 'LED Lighting', 'Fog Machine', 'Playlist Customization'],
    cancellation_policy: 'Full refund if cancelled 15 days before event',
    images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'],
    contact_email: 'info@beatsrhythm.in',
    contact_phone: '+91 98765 43220',
    website: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v12',
    owner_id: 'owner-12',
    name: 'Bridal Glow Makeup',
    category: 'Makeup & Hair',
    description: 'Celebrity makeup artist specializing in bridal makeovers. Using premium international products.',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    price_range: '₹60,000 - ₹1,20,000',
    rating: 4.9,
    review_count: 289,
    verified: true,
    status: 'active',
    response_time_hours: 1,
    portfolio_images: [
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800'
    ],
    services_offered: ['Bridal Makeup', 'HD Makeup', 'Airbrush Makeup', 'Hair Styling', 'Pre-bridal Services'],
    cancellation_policy: '50% refund if cancelled 20 days before event',
    images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800'],
    contact_email: 'contact@bridalglow.in',
    contact_phone: '+91 98765 43221',
    website: 'https://bridalglow.in',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Filter functions
export const filterVendorsByCategory = (category: string) => {
  if (category === 'all') return MOCK_VENDORS;
  return MOCK_VENDORS.filter(v => v.category === category);
};

export const filterVendorsByCity = (city: string) => {
  if (city === 'all') return MOCK_VENDORS;
  return MOCK_VENDORS.filter(v => v.city.toLowerCase() === city.toLowerCase());
};

export const filterVendorsByRating = (minRating: number) => {
  return MOCK_VENDORS.filter(v => v.rating >= minRating);
};

export const searchVendors = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return MOCK_VENDORS.filter(v => 
    v.name.toLowerCase().includes(lowerQuery) ||
    v.category.toLowerCase().includes(lowerQuery) ||
    v.description.toLowerCase().includes(lowerQuery) ||
    v.city.toLowerCase().includes(lowerQuery)
  );
};

// Get unique categories
export const getVendorCategories = () => {
  return Array.from(new Set(MOCK_VENDORS.map(v => v.category)));
};

// Get unique cities
export const getVendorCities = () => {
  return Array.from(new Set(MOCK_VENDORS.map(v => v.city)));
};
