
// Vendor data for use across the application
export const FEATURED_VENDORS = [
  {
    id: '1',
    name: 'Elegant Blooms',
    category: 'Florist',
    location: 'Hauz Khas, New Delhi',
    image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    rating: 4.9,
    startingPrice: 'From ₹50,000',
    priceRange: '₹50,000 - ₹2,00,000',
    email: 'contact@elegantblooms.com',
    phone: '+91-11-4155-1234',
    website: 'www.elegantblooms.in',
    description: 'Elegant Blooms specializes in creating stunning floral arrangements for weddings and special events. With a passion for natural, seasonal designs, we bring beauty and emotion to every celebration.',
    longDescription: "Our team of expert florists works closely with each couple to understand their vision and bring it to life through carefully curated flowers and greenery. We source the freshest blooms from local growers whenever possible, ensuring high quality and sustainability.\n\nFrom lavish centerpieces to delicate boutonnieres, cascading bouquets to ceremony arches, we pay meticulous attention to every detail. Our designs range from classic and romantic to modern and avant-garde, always tailored to complement your venue and overall wedding aesthetic.\n\nWe believe that flowers tell a story and set the tone for your entire event. Let us help you tell your unique love story through the language of flowers.",
    services: [
      'Bridal Bouquets',
      'Bridesmaid Bouquets',
      'Boutonnieres & Corsages',
      'Ceremony Arrangements',
      'Reception Centerpieces',
      'Floral Installations',
      'Flower Crowns',
      'Cake Flowers',
      'Venue Decoration',
      'Setup & Delivery'
    ],
    tags: ['Floral Design', 'Sustainable', 'Custom', 'Delivery'],
    coordinates: {
      lat: 28.5458,
      lng: 77.2008
    },
    reviewCount: 124,
    faqs: [
      {
        question: 'How far in advance should I book your services?',
        answer: 'We recommend booking 6-9 months before your wedding date, especially during peak wedding season (October-February). For popular dates, booking 9-12 months in advance is advisable.'
      },
      {
        question: 'What is the minimum budget for wedding flowers?',
        answer: 'Our wedding flower packages start at ₹50,000, which typically includes a bridal bouquet, 2-3 bridesmaid bouquets, 5-6 boutonnieres, and 2 centerpieces. Custom packages are available to suit your specific needs and budget.'
      },
      {
        question: 'Do you offer consultations?',
        answer: 'Yes, we offer complimentary initial consultations either in person at our studio in Hauz Khas or virtually. This allows us to understand your vision, discuss your flower preferences, and provide personalized recommendations.'
      }
    ],
    reviews: [
      {
        id: '1',
        author: 'Priya & Karthik',
        date: 'March 2023',
        rating: 5,
        content: 'Elegant Blooms created the most breathtaking arrangements for our wedding! From my stunning bouquet to the reception centerpieces, everything was beyond my expectations. The team was professional, creative, and a joy to work with.'
      },
      {
        id: '2',
        author: 'Meenakshi T.',
        date: 'January 2023',
        rating: 4,
        content: 'Beautiful work and professional service. The only reason for 4 instead of 5 stars is that one of the centerpieces was slightly different than what we had discussed, but overall we were very happy with the flowers.'
      }
    ]
  },
  {
    id: '2',
    name: 'Frames Forever Photography',
    category: 'Photographer',
    location: 'Gurugram, Delhi NCR',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
    rating: 4.8,
    startingPrice: 'From ₹85,000',
    priceRange: '₹85,000 - ₹3,50,000',
    email: 'info@framesforever.in',
    phone: '+91-98765-43210',
    website: 'www.framesforever.in',
    description: 'Frames Forever Photography captures the magic of your wedding day with a blend of candid moments and artistic portraits that you\'ll treasure for generations.',
    longDescription: "At Frames Forever, we believe that your wedding photos should tell the complete story of your special day—from the grand moments to the subtle emotions. Our team of experienced photographers specializes in capturing authentic moments with an artistic touch.\n\nWe offer comprehensive wedding photography packages that include pre-wedding shoots, ceremony coverage, reception photography, and beautifully crafted wedding albums. Our post-processing techniques enhance the natural beauty of each image while maintaining authenticity.\n\nWith over 10 years of experience photographing weddings across Delhi NCR, we understand the unique traditions and moments that make Indian weddings special. Let us create timeless memories of your celebration that you\'ll cherish forever.",
    services: [
      'Pre-Wedding Photoshoots',
      'Wedding Day Coverage',
      'Candid Photography',
      'Cinematography',
      'Drone Shots',
      'Same-Day Edits',
      'Premium Photo Albums',
      'Digital Delivery',
      'Family Portraits',
      'Custom Packages'
    ],
    tags: ['Photography', 'Videography', 'Candid', 'Premium'],
    coordinates: {
      lat: 28.4595,
      lng: 77.0266
    },
    reviewCount: 98,
    faqs: [
      {
        question: 'What is included in your standard wedding package?',
        answer: 'Our standard package at ₹85,000 includes 8 hours of coverage with two photographers, a pre-wedding shoot, 300+ edited digital images, and a 30-page wedding album. Additional services like drone coverage and videography can be added.'
      },
      {
        question: 'How soon will we receive our wedding photos?',
        answer: 'You will receive a curated selection of 50-75 images within 1 week of your wedding. The complete set of edited images will be delivered within 4-6 weeks, and physical albums take an additional 2-3 weeks.'
      }
    ],
    reviews: [
      {
        id: '1',
        author: 'Anjali & Rajeev',
        date: 'February 2023',
        rating: 5,
        content: 'Working with Frames Forever was one of the best decisions we made for our wedding. They captured every emotion and moment perfectly, and our album is absolutely stunning!'
      },
      {
        id: '2',
        author: 'Kabir & Zoya',
        date: 'December 2022',
        rating: 5,
        content: 'The team was incredibly professional and unobtrusive during our ceremonies, yet somehow managed to capture all the key moments. The photos are artistic and beautiful.'
      }
    ]
  },
  {
    id: '3',
    name: 'Delhi Catering Company',
    category: 'Catering',
    location: 'Connaught Place, New Delhi',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    rating: 4.7,
    startingPrice: 'From ₹1200 per plate',
    priceRange: '₹1,200 - ₹3,500 per plate',
    email: 'bookings@delhicatering.com',
    phone: '+91-11-2345-6789',
    website: 'www.delhicatering.com',
    description: 'Delhi Catering Company specializes in multi-cuisine wedding menus, from traditional Indian fare to international cuisines, all prepared with the finest ingredients.',
    longDescription: "With over 15 years of experience catering for Delhi\'s most prestigious weddings, we pride ourselves on culinary excellence and impeccable service. Our team includes award-winning chefs specialized in various cuisines including North Indian, South Indian, Mughlai, Continental, Chinese, and more.\n\nWe offer customized menus based on your preferences and dietary requirements. From lavish buffets to elegant plated services, live cooking stations to themed food displays, we handle everything with attention to detail and artistic presentation.\n\nOur services extend beyond just food preparation—we provide complete catering solutions including professional service staff, elegant serving equipment, and beautiful food displays that complement your wedding decor.",
    services: [
      'Customized Wedding Menus',
      'Multi-cuisine Options',
      'Live Cooking Stations',
      'Buffet Setup',
      'Plated Service',
      'Chaat Counters',
      'Dessert Stations',
      'Bar Service',
      'Thematic Food Displays',
      'Professional Service Staff'
    ],
    tags: ['Multi-cuisine', 'Premium', 'Custom Menus', 'Live Counters'],
    coordinates: {
      lat: 28.6315,
      lng: 77.2167
    },
    reviewCount: 156,
    reviews: [
      {
        id: '1',
        author: 'Sharma Family',
        date: 'April 2023',
        rating: 5,
        content: 'The food at our daughter\'s wedding was exceptional! Delhi Catering Company provided an extensive menu that catered to all tastes. The live stations were a hit, and guests are still talking about the dessert spread.'
      },
      {
        id: '2',
        author: 'Mehta Family',
        date: 'February 2023',
        rating: 4,
        content: 'Overall great experience with Delhi Catering. The food quality and variety were excellent. Removed one star because there was a slight delay in setting up one of the counters, but they quickly resolved it.'
      }
    ]
  },
  {
    id: '4',
    name: 'Makeup by Mehak',
    category: 'Makeup Artist',
    location: 'South Extension, Delhi',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    rating: 4.9,
    startingPrice: 'From ₹35,000',
    priceRange: '₹35,000 - ₹75,000',
    email: 'bookings@makeupmehak.com',
    phone: '+91-99876-54321',
    website: 'www.makeupmehak.com',
    description: 'Mehak is a renowned makeup artist specializing in bridal makeup that enhances natural beauty while creating a look that lasts throughout your special day.',
    tags: ['Bridal Makeup', 'HD Makeup', 'Hairstyling', 'Celebrity Artist'],
    coordinates: {
      lat: 28.5717,
      lng: 77.2248
    },
    reviewCount: 215
  },
  {
    id: '5',
    name: 'Event Elegance',
    category: 'Wedding Planner',
    location: 'Vasant Kunj, New Delhi',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    rating: 4.8,
    startingPrice: 'From ₹2,00,000',
    priceRange: '₹2,00,000 - ₹10,00,000',
    email: 'plan@eventelegance.in',
    phone: '+91-98765-12345',
    website: 'www.eventelegance.in',
    description: 'Event Elegance is a full-service wedding planning company that handles everything from venue selection to day-of coordination, ensuring a stress-free experience.',
    tags: ['Full Planning', 'Destination Weddings', 'Luxury', 'Coordination'],
    coordinates: {
      lat: 28.5213,
      lng: 77.1527
    },
    reviewCount: 87
  },
  {
    id: '6',
    name: 'Royal Rides',
    category: 'Transportation',
    location: 'Noida, Delhi NCR',
    image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae',
    rating: 4.6,
    startingPrice: 'From ₹15,000',
    priceRange: '₹15,000 - ₹1,50,000',
    email: 'bookings@royalrides.in',
    phone: '+91-120-987-6543',
    website: 'www.royalrides.in',
    description: 'Royal Rides offers a fleet of luxury vehicles for your wedding day, including vintage cars, premium sedans, and decorated horses for the baraat.',
    tags: ['Luxury Cars', 'Vintage Collection', 'Baraat', 'Decorated Vehicles'],
    coordinates: {
      lat: 28.5355,
      lng: 77.3910
    },
    reviewCount: 62
  },
  {
    id: '7',
    name: 'Beats & Rhythms',
    category: 'DJ & Entertainment',
    location: 'Rajouri Garden, Delhi',
    image: 'https://images.unsplash.com/photo-1464982326199-86f32f81b211',
    rating: 4.7,
    startingPrice: 'From ₹45,000',
    priceRange: '₹45,000 - ₹1,25,000',
    email: 'bookings@beatsandrhythms.com',
    phone: '+91-98123-45678',
    website: 'www.beatsandrhythms.com',
    description: 'Beats & Rhythms provides high-energy entertainment with professional DJs, sound systems, lighting setups, and live performers for all your wedding functions.',
    tags: ['DJ Services', 'Live Music', 'Sound & Lighting', 'Entertainment'],
    coordinates: {
      lat: 28.6457,
      lng: 77.1192
    },
    reviewCount: 124
  },
  {
    id: '8',
    name: 'Sweet Indulgence',
    category: 'Cake & Desserts',
    location: 'Greater Kailash, Delhi',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    rating: 4.8,
    startingPrice: 'From ₹12,000',
    priceRange: '₹12,000 - ₹50,000',
    email: 'orders@sweetindulgence.com',
    phone: '+91-11-4567-8901',
    website: 'www.sweetindulgence.in',
    description: 'Sweet Indulgence creates custom wedding cakes and dessert tables that are as beautiful as they are delicious, using the finest ingredients and artistic designs.',
    tags: ['Custom Cakes', 'Dessert Tables', 'Eggless Options', 'Themed Designs'],
    coordinates: {
      lat: 28.5534,
      lng: 77.2350
    },
    reviewCount: 96
  },
  {
    id: '9',
    name: 'Saree Couture',
    category: 'Bridal Wear',
    location: 'Chandni Chowk, Delhi',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
    rating: 4.9,
    startingPrice: 'From ₹50,000',
    priceRange: '₹50,000 - ₹5,00,000',
    email: 'appointments@sareecouture.com',
    phone: '+91-11-2345-1234',
    website: 'www.sareecouture.in',
    description: 'Saree Couture offers exquisite bridal lehengas, sarees, and gowns, combining traditional craftsmanship with contemporary designs for the modern Indian bride.',
    tags: ['Bridal Lehengas', 'Designer Sarees', 'Custom Designs', 'Heritage Crafts'],
    coordinates: {
      lat: 28.6562,
      lng: 77.2310
    },
    reviewCount: 178
  },
  {
    id: '10',
    name: 'Dhol Baaje',
    category: 'Traditional Music',
    location: 'Dwarka, New Delhi',
    image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae',
    rating: 4.7,
    startingPrice: 'From ₹25,000',
    priceRange: '₹25,000 - ₹75,000',
    email: 'bookings@dholbaaje.com',
    phone: '+91-99876-12345',
    website: 'www.dholbaaje.com',
    description: 'Dhol Baaje brings traditional North Indian wedding music to life with energetic dhol players, nagada, shehnai, and folk musicians for a vibrant baraat and ceremonies.',
    tags: ['Dhol Players', 'Folk Music', 'Baraat', 'Traditional'],
    coordinates: {
      lat: 28.5921,
      lng: 77.0461
    },
    reviewCount: 143
  },
  {
    id: '11',
    name: 'Noida Tent House',
    category: 'Decor & Tenting',
    location: 'Sector 18, Noida',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rating: 4.6,
    startingPrice: 'From ₹1,50,000',
    priceRange: '₹1,50,000 - ₹10,00,000',
    email: 'info@noidatenthouse.com',
    phone: '+91-120-456-7890',
    website: 'www.noidatenthouse.com',
    description: 'Noida Tent House provides comprehensive decor solutions including tent structures, stage setups, lighting arrangements, and themed decorations for all wedding functions.',
    tags: ['Tenting', 'Theme Decor', 'Lighting', 'Stage Design'],
    coordinates: {
      lat: 28.5707,
      lng: 77.3260
    },
    reviewCount: 115
  },
  {
    id: '12',
    name: 'Invites & More',
    category: 'Invitations',
    location: 'Lajpat Nagar, Delhi',
    image: 'https://images.unsplash.com/photo-1515001621567-98069a800a67',
    rating: 4.8,
    startingPrice: 'From ₹150 per card',
    priceRange: '₹150 - ₹1,500 per card',
    email: 'orders@invitesandmore.in',
    phone: '+91-98765-09876',
    website: 'www.invitesandmore.in',
    description: 'Invites & More creates bespoke wedding invitations, from traditional cards with intricate designs to modern digital invitations with multimedia elements.',
    tags: ['Custom Invitations', 'Digital Invites', 'Luxury Cards', 'Packaging'],
    coordinates: {
      lat: 28.5708,
      lng: 77.2432
    },
    reviewCount: 89
  }
];

// Categories for filtering vendors
export const VENDOR_CATEGORIES = [
  'Wedding Planner',
  'Photographer',
  'Videographer',
  'Makeup Artist',
  'Bridal Wear',
  'Groom Wear',
  'Florist',
  'Catering',
  'Cake & Desserts',
  'DJ & Entertainment',
  'Transportation',
  'Decor & Tenting',
  'Invitations',
  'Jewelry',
  'Traditional Music',
  'Mehndi Artist'
];

// Locations for filtering vendors in Delhi NCR
export const VENDOR_LOCATIONS = [
  'New Delhi',
  'Noida',
  'Greater Noida',
  'Gurugram',
  'Faridabad',
  'Ghaziabad',
  'Dwarka',
  'South Delhi',
  'North Delhi',
  'East Delhi',
  'West Delhi'
];
