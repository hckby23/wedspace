// Venue data for use across the application

export interface Venue {
  id: string;
  name: string;
  location: string;
  city?: string;
  state?: string;
  image: string;
  rating: number;
  priceRange: string;
  price?: number;
  description: string;
  tags: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  capacity: {
    min: number;
    max: number;
  };
  amenities: string[];
  reviews: Array<{
    id: string;
    author: string;
    date: string;
    rating: number;
    content: string;
  }>;
  verified?: boolean;
  status?: string;
}

export const FEATURED_VENUES: Venue[] = [
  {
    id: '1',
    name: 'The Grand New Delhi',
    location: 'Nelson Mandela Road, Vasant Kunj, New Delhi',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rating: 4.8,
    priceRange: '₹2,00,000 - ₹5,00,000',
    description: 'The Grand New Delhi is a 5-star luxury hotel offering opulent wedding venues with state-of-the-art facilities and impeccable service.',
    tags: ['Luxury', 'Hotel', '5-Star'],
    coordinates: {
      lat: 28.5394,
      lng: 77.1204
    },
    contactInfo: {
      phone: '+91-11-2677-1234',
      email: 'events@thegrandnewdelhi.com',
      website: 'www.thegrandnewdelhi.com'
    },
    capacity: {
      min: 100,
      max: 1000
    },
    amenities: [
      'Banquet Halls', 'Lawns/Poolside', 'Bridal Suite',
      'In-house Catering', 'Alcohol License', 'DJ/Music',
      'Parking', 'Accommodation', 'Air Conditioning'
    ],
    reviews: [
      {
        id: '1',
        author: 'Priya & Rahul',
        date: 'March 2023',
        rating: 5,
        content: 'The Grand New Delhi exceeded all our expectations! The venue is even more beautiful in person, and the staff was incredibly helpful throughout the planning process. Our guests are still talking about how magical our wedding was.'
      },
      {
        id: '2',
        author: 'Ananya & Vikram',
        date: 'December 2022',
        rating: 4,
        content: 'We had our dream wedding at The Grand New Delhi. The venue was stunning and made for perfect photos. The only small issue was coordinating with some of the staff members, but overall it was a wonderful experience.'
      }
    ]
  },
  {
    id: '2',
    name: 'Jaypee Greens Golf & Spa Resort',
    location: 'Surajpur Kasna Road, Greater Noida',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    rating: 4.7,
    priceRange: '₹2,50,000 - ₹6,00,000',
    description: 'Set amidst an 18-hole golf course, Jaypee Greens offers luxurious indoor and outdoor wedding venues surrounded by lush greenery.',
    tags: ['Resort', 'Golf Course', 'Outdoor'],
    coordinates: {
      lat: 28.4744,
      lng: 77.5040
    },
    contactInfo: {
      phone: '+91-120-674-2424',
      email: 'sales.jggr@jaypeehotels.com',
      website: 'www.jaypeehotels.com'
    },
    capacity: {
      min: 200,
      max: 1500
    },
    amenities: [
      'Golf Course View', 'Multiple Halls', 'Outdoor Spaces',
      'In-house Catering', 'Alcohol License', 'Valet Parking',
      'Accommodation', 'Spa', 'Swimming Pool'
    ],
    reviews: [
      {
        id: '1',
        author: 'Meera & Arjun',
        date: 'January 2023',
        rating: 5,
        content: 'Our wedding at Jaypee Greens was like a fairytale! The golf course backdrop was breathtaking, and the staff went above and beyond to make our day perfect.'
      },
      {
        id: '2',
        author: 'Riya & Aarav',
        date: 'November 2022',
        rating: 4,
        content: 'Beautiful venue with excellent amenities. The only drawback was the slightly remote location for some of our guests, but the resort accommodation made up for it.'
      }
    ]
  },
  {
    id: '3',
    name: 'Radisson Blu MBD Hotel',
    location: 'Plot Number 1, Sector 18, Noida',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    rating: 4.6,
    priceRange: '₹1,80,000 - ₹4,50,000',
    description: 'Radisson Blu MBD Hotel Noida offers elegant wedding venues with contemporary décor and professional event planning services.',
    tags: ['Hotel', 'Urban', 'Elegant'],
    coordinates: {
      lat: 28.5702,
      lng: 77.3218
    },
    contactInfo: {
      phone: '+91-120-430-0000',
      email: 'events.noida@radissonblu.com',
      website: 'www.radissonblu.com/noida'
    },
    capacity: {
      min: 100,
      max: 800
    },
    amenities: [
      'Banquet Halls', 'Terrace Garden', 'Modern Interiors',
      'In-house Catering', 'Bar Service', 'Valet Parking',
      'Accommodation', 'Shopping Mall Access', 'Customized Décor'
    ],
    reviews: [
      {
        id: '1',
        author: 'Neha & Karan',
        date: 'April 2023',
        rating: 5,
        content: 'Radisson Blu MBD Noida was the perfect venue for our wedding. The central location made it convenient for all our guests, and the food was exceptional!'
      },
      {
        id: '2',
        author: 'Aisha & Omar',
        date: 'February 2023',
        rating: 4,
        content: 'We loved the elegant ambiance and attentive service. The event coordinator was extremely helpful in planning all aspects of our reception.'
      }
    ]
  },
  {
    id: '4',
    name: 'Taj Palace',
    location: 'Diplomatic Enclave, 2, Sardar Patel Marg, New Delhi',
    image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098',
    rating: 4.9,
    priceRange: '₹3,00,000 - ₹8,00,000',
    description: 'An iconic landmark in the capital city, Taj Palace offers luxurious banquet halls and lush green lawns for fairy-tale weddings.',
    tags: ['Heritage', 'Luxury', 'Garden'],
    coordinates: {
      lat: 28.6014,
      lng: 77.1729
    },
    contactInfo: {
      phone: '+91-11-2611-0202',
      email: 'palace.delhi@tajhotels.com',
      website: 'www.tajhotels.com'
    },
    capacity: {
      min: 150,
      max: 1200
    },
    amenities: [
      'Multiple Banquet Halls', 'Landscaped Gardens', 'Presidential Suite',
      'Award-winning Chefs', 'Premium Alcohol Service', 'Valet Parking',
      'Luxury Accommodation', 'Spa Services', 'Wedding Planning Team'
    ],
    reviews: [
      {
        id: '1',
        author: 'Tanya & Varun',
        date: 'December 2022',
        rating: 5,
        content: 'Taj Palace provided the royal wedding experience we always dreamed of. Every detail was perfect, from the decor to the service to the food.'
      },
      {
        id: '2',
        author: 'Sonia & Nikhil',
        date: 'October 2022',
        rating: 5,
        content: 'If you want luxury and perfection, Taj Palace is the venue to choose. Our guests still talk about how magnificent our wedding was.'
      }
    ]
  },
  {
    id: '5',
    name: 'Crowne Plaza Greater Noida',
    location: 'Surajpur Chowk, Greater Noida',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b',
    rating: 4.5,
    priceRange: '₹1,50,000 - ₹4,00,000',
    description: 'Crowne Plaza offers versatile wedding venues including a grand ballroom and outdoor spaces with customizable catering options.',
    tags: ['International', 'Ballroom', 'Modern'],
    coordinates: {
      lat: 28.4947,
      lng: 77.5277
    },
    contactInfo: {
      phone: '+91-120-673-5000',
      email: 'events.cpgn@ihg.com',
      website: 'www.crowneplaza.com/greaternoida'
    },
    capacity: {
      min: 100,
      max: 1000
    },
    amenities: [
      'Grand Ballroom', 'Outdoor Venue', 'Conference Rooms',
      'Multi-cuisine Catering', 'Alcohol Service', 'Ample Parking',
      'Accommodation', 'Business Center', 'Customized Themes'
    ],
    reviews: [
      {
        id: '1',
        author: 'Deepti & Raghav',
        date: 'March 2023',
        rating: 4,
        content: 'We had a wonderful experience at Crowne Plaza. The ballroom was beautifully set up for our reception, and the food was delicious.'
      },
      {
        id: '2',
        author: 'Ayesha & Imran',
        date: 'January 2023',
        rating: 5,
        content: 'Crowne Plaza Greater Noida offered great value for money. The staff was accommodating with all our cultural requirements and preferences.'
      }
    ]
  },
  {
    id: '6',
    name: 'The Leela Ambience Convention Hotel',
    location: '1, CBD, Maharaja Surajmal Road, Delhi',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
    rating: 4.8,
    priceRange: '₹2,50,000 - ₹7,00,000',
    description: 'The Leela Ambience features Delhi\'s largest convention center with pillarless ballrooms and sophisticated event spaces.',
    tags: ['Luxury', 'Convention Center', 'Urban'],
    coordinates: {
      lat: 28.6256,
      lng: 77.3080
    },
    contactInfo: {
      phone: '+91-11-7172-1234',
      email: 'events.delhi@theleela.com',
      website: 'www.theleela.com'
    },
    capacity: {
      min: 200,
      max: 2500
    },
    amenities: [
      'Pillarless Ballroom', 'Multiple Event Spaces', 'Bridal Suites',
      'Celebrity Chefs', 'Premium Bar Service', 'Valet Parking',
      'Luxury Accommodation', 'Spa & Wellness', 'Wedding Specialists'
    ],
    reviews: [
      {
        id: '1',
        author: 'Natasha & Vikrant',
        date: 'May 2023',
        rating: 5,
        content: 'The Leela Ambience provided the perfect setting for our grand wedding. The massive ballroom accommodated all our guests comfortably, and the service was impeccable.'
      },
      {
        id: '2',
        author: 'Preeti & Rohit',
        date: 'February 2023',
        rating: 4,
        content: 'Beautiful venue with excellent food and service. The only reason for 4 stars instead of 5 was some miscommunication regarding the setup timing.'
      }
    ]
  },
  {
    id: '7',
    name: 'Hyatt Regency Delhi',
    location: 'Bhikaji Cama Place, Ring Road, New Delhi',
    image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae',
    rating: 4.7,
    priceRange: '₹2,20,000 - ₹6,50,000',
    description: 'Hyatt Regency Delhi offers versatile venues for weddings, from intimate ceremonies to grand celebrations with impeccable service.',
    tags: ['Hotel', '5-Star', 'Central Location'],
    coordinates: {
      lat: 28.5730,
      lng: 77.1871
    },
    contactInfo: {
      phone: '+91-11-2679-1234',
      email: 'delhi.regency@hyatt.com',
      website: 'www.hyattregencydelhi.com'
    },
    capacity: {
      min: 100,
      max: 1000
    },
    amenities: [
      'Multiple Ballrooms', 'Outdoor Pool Deck', 'Elegant Interiors',
      'Award-winning Cuisine', 'Premium Bar', 'Valet Service',
      '5-Star Accommodation', 'Spa Facilities', 'Event Coordination'
    ],
    reviews: [
      {
        id: '1',
        author: 'Simran & Aryan',
        date: 'April 2023',
        rating: 5,
        content: 'Hyatt Regency Delhi was the ideal venue for our wedding. The central location, exquisite food, and professional staff made our celebration truly memorable.'
      },
      {
        id: '2',
        author: 'Maya & Dhruv',
        date: 'November 2022',
        rating: 4,
        content: 'We had a wonderful experience at Hyatt Regency. The wedding planning team was extremely helpful, and the venue looked stunning with our chosen decor.'
      }
    ]
  },
  {
    id: '8',
    name: 'The Umrao',
    location: 'National Highway 8, New Delhi',
    image: 'https://images.unsplash.com/photo-1515001621567-98069a800a67',
    rating: 4.5,
    priceRange: '₹1,50,000 - ₹4,00,000',
    description: 'The Umrao is a luxury resort with beautiful indoor and outdoor venues, perfect for hosting memorable wedding celebrations.',
    tags: ['Resort', 'Garden', 'Banquet'],
    coordinates: {
      lat: 28.4914,
      lng: 77.0859
    },
    contactInfo: {
      phone: '+91-11-3310-4500',
      email: 'events@theumrao.com',
      website: 'www.theumrao.com'
    },
    capacity: {
      min: 150,
      max: 1000
    },
    amenities: [
      'Lush Gardens', 'Banquet Halls', 'Poolside Venue',
      'Customized Menus', 'Bar Facilities', 'Ample Parking',
      'Resort Accommodation', 'Spa & Wellness', 'Decor Services'
    ],
    reviews: [
      {
        id: '1',
        author: 'Divya & Aditya',
        date: 'February 2023',
        rating: 4,
        content: 'The Umrao provided a beautiful setting for our wedding. The garden ceremony was exactly as we had envisioned, and the staff was very accommodating.'
      },
      {
        id: '2',
        author: 'Neetu & Sanjay',
        date: 'December 2022',
        rating: 5,
        content: 'We had our sangeet and wedding reception at The Umrao, and both events were flawlessly executed. Great venue for multiple functions!'
      }
    ]
  },
  {
    id: '9',
    name: 'Pullman Noida',
    location: 'Sector 38A, Noida',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    rating: 4.6,
    priceRange: '₹1,80,000 - ₹5,00,000',
    description: 'A premium 5-star hotel offering sophisticated venues and personalized wedding planning services in the heart of Noida.',
    tags: ['Premium', 'Hotel', 'Contemporary'],
    coordinates: {
      lat: 28.5617,
      lng: 77.3417
    },
    contactInfo: {
      phone: '+91-120-425-0000',
      email: 'events.pullmannoida@accor.com',
      website: 'www.pullmannoida.com'
    },
    capacity: {
      min: 100,
      max: 800
    },
    amenities: [
      'Contemporary Ballroom', 'Outdoor Terrace', 'Flexible Spaces',
      'International Cuisine', 'Premium Beverages', 'Valet Service',
      'Luxury Accommodation', 'Fitness Center', 'Tech-enabled Venues'
    ],
    reviews: [
      {
        id: '1',
        author: 'Kritika & Nitin',
        date: 'March 2023',
        rating: 5,
        content: 'Pullman Noida exceeded our expectations in every way. The venues are modern and elegant, and the food was absolutely delicious.'
      },
      {
        id: '2',
        author: 'Jyoti & Prakash',
        date: 'January 2023',
        rating: 4,
        content: 'We had a great experience hosting our wedding at Pullman. The hotel\'s central location in Noida was very convenient for all our guests.'
      }
    ]
  },
  {
    id: '10',
    name: 'Shangri-La Eros Hotel',
    location: '19, Ashoka Road, Connaught Place, New Delhi',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rating: 4.8,
    priceRange: '₹2,50,000 - ₹7,00,000',
    description: 'Located in the heart of New Delhi, Shangri-La Eros Hotel offers elegant venues with personalized wedding planning services.',
    tags: ['Luxury', 'Central', 'International'],
    coordinates: {
      lat: 28.6268,
      lng: 77.2195
    },
    contactInfo: {
      phone: '+91-11-4119-1919',
      email: 'events.slnd@shangri-la.com',
      website: 'www.shangri-la.com/newdelhi'
    },
    capacity: {
      min: 100,
      max: 1000
    },
    amenities: [
      'Grand Ballroom', 'Garden Courtyard', 'Multiple Function Rooms',
      'Exquisite Catering', 'Premium Bar Options', 'Valet Parking',
      'Luxury Accommodation', 'Spa & Wellness', 'Wedding Specialists'
    ],
    reviews: [
      {
        id: '1',
        author: 'Aditi & Vivek',
        date: 'May 2023',
        rating: 5,
        content: 'Shangri-La Eros provided the perfect backdrop for our wedding. The central location, the attentive staff, and the beautiful decor made our day truly special.'
      },
      {
        id: '2',
        author: 'Radhika & Sameer',
        date: 'February 2023',
        rating: 4,
        content: 'We had a wonderful experience at Shangri-La. The food was exceptional, and the wedding planners were very professional and helpful.'
      }
    ]
  },
  {
    id: '11',
    name: 'ITC Maurya',
    location: 'Diplomatic Enclave, Sardar Patel Marg, New Delhi',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    rating: 4.9,
    priceRange: '₹3,00,000 - ₹9,00,000',
    description: 'ITC Maurya offers a blend of luxury and tradition, with magnificent venues for grand weddings and intimate celebrations alike.',
    tags: ['Luxury', '5-Star', 'Heritage'],
    coordinates: {
      lat: 28.5993,
      lng: 77.1764
    },
    contactInfo: {
      phone: '+91-11-2611-2233',
      email: 'reservations.maurya@itchotels.in',
      website: 'www.itchotels.com/itcmaurya'
    },
    capacity: {
      min: 150,
      max: 1500
    },
    amenities: [
      'Grand Ballroom', 'Outdoor Gardens', 'Presidential Suite',
      'Award-winning Cuisine', 'Premium Beverages', 'Valet Service',
      'Luxury Accommodation', 'Spa & Wellness', 'Wedding Concierge'
    ],
    reviews: [
      {
        id: '1',
        author: 'Anjali & Rohan',
        date: 'April 2023',
        rating: 5,
        content: 'Our wedding at ITC Maurya was nothing short of magical. The venue is stunning, the food from Bukhara and Dum Pukht was exceptional, and the service was impeccable.'
      },
      {
        id: '2',
        author: 'Sarika & Rajiv',
        date: 'December 2022',
        rating: 5,
        content: 'ITC Maurya provided a royal experience for our wedding. From the moment our guests arrived, they were treated like royalty. Worth every rupee!'
      }
    ]
  },
  {
    id: '12',
    name: 'Taj City Centre Gurugram',
    location: 'Sector 44, Gurugram, Delhi NCR',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
    rating: 4.7,
    priceRange: '₹2,50,000 - ₹6,50,000',
    description: 'Located in the heart of Gurugram\'s business district, Taj City Centre offers sophisticated venues with modern amenities and traditional hospitality.',
    tags: ['Luxury', 'Urban', 'Modern'],
    coordinates: {
      lat: 28.4595,
      lng: 77.0266
    },
    contactInfo: {
      phone: '+91-124-663-1313',
      email: 'citycentre.gurugram@tajhotels.com',
      website: 'www.tajhotels.com/gurugram'
    },
    capacity: {
      min: 150,
      max: 1000
    },
    amenities: [
      'Grand Crystal Ballroom', 'Poolside Venue', 'Multiple Function Rooms',
      'Customized Catering', 'Premium Bar Service', 'Valet Parking',
      'Luxury Accommodation', 'Spa Services', 'Event Coordination'
    ],
    reviews: [
      {
        id: '1',
        author: 'Nisha & Akshay',
        date: 'March 2023',
        rating: 5,
        content: 'Taj City Centre was the perfect venue for our wedding. The ballroom was beautifully decorated, and the staff went above and beyond to make our day special.'
      },
      {
        id: '2',
        author: 'Kanika & Vishal',
        date: 'January 2023',
        rating: 4,
        content: 'We had a wonderful experience at Taj City Centre. The food was delicious, the decor was elegant, and the service was excellent.'
      }
    ]
  },
  {
    id: '13',
    name: 'The Oberoi, New Delhi',
    location: 'Dr Zakir Hussain Marg, New Delhi',
    image: 'https://images.unsplash.com/photo-1510076857177-7470076d4098',
    rating: 4.9,
    priceRange: '₹3,50,000 - ₹10,00,000',
    description: 'The newly renovated Oberoi, New Delhi offers the city\'s most exclusive wedding venues with panoramic views and unparalleled luxury.',
    tags: ['Ultra Luxury', 'Iconic', 'Central'],
    coordinates: {
      lat: 28.6014,
      lng: 77.2386
    },
    contactInfo: {
      phone: '+91-11-2436-3030',
      email: 'reservations.tonde@oberoihotels.com',
      website: 'www.oberoihotels.com/newdelhi'
    },
    capacity: {
      min: 100,
      max: 800
    },
    amenities: [
      'Elegant Ballrooms', 'Rooftop Terrace', 'Bespoke Venues',
      'Michelin-inspired Cuisine', 'Premium Bar Selection', 'Luxury Car Service',
      '5-Star Accommodation', 'Luxury Spa', 'Dedicated Wedding Team'
    ],
    reviews: [
      {
        id: '1',
        author: 'Shalini & Mihir',
        date: 'April 2023',
        rating: 5,
        content: 'The Oberoi provided a level of luxury and service that was beyond our expectations. Every detail was meticulously planned and executed to perfection.'
      },
      {
        id: '2',
        author: 'Pooja & Arvind',
        date: 'February 2023',
        rating: 5,
        content: 'Our wedding at The Oberoi was a dream come true. The venue is absolutely stunning, and the staff\'s attention to detail made our celebration truly extraordinary.'
      }
    ]
  },
  {
    id: '14',
    name: 'Welcomhotel by ITC Hotels, Dwarka',
    location: 'Plot No. 3, Sector 10, Dwarka, New Delhi',
    image: 'https://images.unsplash.com/photo-1464982326199-86f32f81b211',
    rating: 4.6,
    priceRange: '₹1,50,000 - ₹4,50,000',
    description: 'Welcomhotel Dwarka offers spacious banquet halls and outdoor venues, making it ideal for weddings of varying sizes and budgets.',
    tags: ['Affordable Luxury', 'Spacious', 'Accessible'],
    coordinates: {
      lat: 28.5818,
      lng: 77.0587
    },
    contactInfo: {
      phone: '+91-11-3090-0000',
      email: 'reservations.whnd@itchotels.in',
      website: 'www.itchotels.com/dwarka'
    },
    capacity: {
      min: 100,
      max: 1200
    },
    amenities: [
      'Multiple Banquet Halls', 'Outdoor Lawn', 'Flexible Spaces',
      'Multiple Cuisine Options', 'Bar Service', 'Ample Parking',
      'Comfortable Accommodation', 'Wellness Center', 'Event Managers'
    ],
    reviews: [
      {
        id: '1',
        author: 'Kavita & Suresh',
        date: 'March 2023',
        rating: 4,
        content: 'Welcomhotel Dwarka offered great value for money. The spaces were well-maintained, and the food was delicious with plenty of options to choose from.'
      },
      {
        id: '2',
        author: 'Meenakshi & Pankaj',
        date: 'January 2023',
        rating: 5,
        content: 'We had a wonderful experience hosting our wedding at Welcomhotel Dwarka. The staff was very accommodating and helped us plan a beautiful celebration within our budget.'
      }
    ]
  },
  {
    id: '15',
    name: 'Vivanta New Delhi, Dwarka',
    location: 'Sector 21, Metro Station Complex, Dwarka, New Delhi',
    image: 'https://images.unsplash.com/photo-1515001621567-98069a800a67',
    rating: 4.5,
    priceRange: '₹1,40,000 - ₹3,80,000',
    description: 'Vivanta New Delhi offers contemporary spaces for modern weddings, with excellent connectivity and comprehensive event services.',
    tags: ['Contemporary', 'Metro Access', 'Value'],
    coordinates: {
      lat: 28.5531,
      lng: 77.0564
    },
    contactInfo: {
      phone: '+91-11-6600-3000',
      email: 'vivanta.dwarka@tajhotels.com',
      website: 'www.vivantahotels.com/dwarka'
    },
    capacity: {
      min: 100,
      max: 750
    },
    amenities: [
      'Banquet Halls', 'Pre-function Areas', 'Modern Design',
      'Multi-cuisine Options', 'Bar Facilities', 'Metro Connectivity',
      'Contemporary Rooms', 'Fitness Center', 'Wedding Coordination'
    ],
    reviews: [
      {
        id: '1',
        author: 'Ritika & Vinay',
        date: 'February 2023',
        rating: 4,
        content: 'Vivanta Dwarka was a great choice for our wedding. The metro connectivity made it easy for guests to reach, and the halls were beautifully set up.'
      },
      {
        id: '2',
        author: 'Shruti & Anand',
        date: 'December 2022',
        rating: 5,
        content: 'We had a wonderful experience at Vivanta. The staff was very professional, and they helped us create a beautiful wedding within our budget.'
      }
    ]
  }
];

// Export vendor data for Delhi NCR
export const DELHI_NCR_VENDORS = [
  {
    id: '1',
    name: 'Elegant Blooms',
    category: 'Florist',
    location: 'Hauz Khas, New Delhi',
    image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200',
    rating: 4.9,
    startingPrice: 'From ₹50,000',
    email: 'contact@elegantblooms.com',
    phone: '+91-11-4155-1234',
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
    tags: ['Floral Design', 'Sustainable', 'Custom', 'Delivery']
  },
  {
    id: '2',
    name: 'Frames Forever Photography',
    category: 'Photographer',
    location: 'Gurugram, Delhi NCR',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
    rating: 4.8,
    startingPrice: 'From ₹85,000',
    email: 'info@framesforever.in',
    phone: '+91-98765-43210',
    description: 'Frames Forever Photography captures the magic of your wedding day with a blend of candid moments and artistic portraits that you\'ll treasure for generations.',
    tags: ['Photography', 'Videography', 'Candid', 'Premium']
  },
  {
    id: '3',
    name: 'Delhi Catering Company',
    category: 'Catering',
    location: 'Connaught Place, New Delhi',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    rating: 4.7,
    startingPrice: 'From ₹1200 per plate',
    email: 'bookings@delhicatering.com',
    phone: '+91-11-2345-6789',
    description: 'Delhi Catering Company specializes in multi-cuisine wedding menus, from traditional Indian fare to international cuisines, all prepared with the finest ingredients.',
    tags: ['Multi-cuisine', 'Premium', 'Custom Menus', 'Live Counters']
  },
  {
    id: '4',
    name: 'Makeup by Mehak',
    category: 'Makeup Artist',
    location: 'South Extension, Delhi',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
    rating: 4.9,
    startingPrice: 'From ₹35,000',
    email: 'bookings@makeupmehak.com',
    phone: '+91-99876-54321',
    description: 'Mehak is a renowned makeup artist specializing in bridal makeup that enhances natural beauty while creating a look that lasts throughout your special day.',
    tags: ['Bridal Makeup', 'HD Makeup', 'Hairstyling', 'Celebrity Artist']
  },
  {
    id: '5',
    name: 'Event Elegance',
    category: 'Wedding Planner',
    location: 'Vasant Kunj, New Delhi',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
    rating: 4.8,
    startingPrice: 'From ₹2,00,000',
    email: 'plan@eventelegance.in',
    phone: '+91-98765-12345',
    description: 'Event Elegance is a full-service wedding planning company that handles everything from venue selection to day-of coordination, ensuring a stress-free experience.',
    tags: ['Full Planning', 'Destination Weddings', 'Luxury', 'Coordination']
  },
  {
    id: '6',
    name: 'Royal Rides',
    category: 'Transportation',
    location: 'Noida, Delhi NCR',
    image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae',
    rating: 4.6,
    startingPrice: 'From ₹15,000',
    email: 'bookings@royalrides.in',
    phone: '+91-120-987-6543',
    description: 'Royal Rides offers a fleet of luxury vehicles for your wedding day, including vintage cars, premium sedans, and decorated horses for the baraat.',
    tags: ['Luxury Cars', 'Vintage Collection', 'Baraat', 'Decorated Vehicles']
  },
  {
    id: '7',
    name: 'Beats & Rhythms',
    category: 'DJ & Entertainment',
    location: 'Rajouri Garden, Delhi',
    image: 'https://images.unsplash.com/photo-1464982326199-86f32f81b211',
    rating: 4.7,
    startingPrice: 'From ₹45,000',
    email: 'bookings@beatsandrhythms.com',
    phone: '+91-98123-45678',
    description: 'Beats & Rhythms provides high-energy entertainment with professional DJs, sound systems, lighting setups, and live performers for all your wedding functions.',
    tags: ['DJ Services', 'Live Music', 'Sound & Lighting', 'Entertainment']
  },
  {
    id: '8',
    name: 'Sweet Indulgence',
    category: 'Cake & Desserts',
    location: 'Greater Kailash, Delhi',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
    rating: 4.8,
    startingPrice: 'From ₹12,000',
    email: 'orders@sweetindulgence.com',
    phone: '+91-11-4567-8901',
    description: 'Sweet Indulgence creates custom wedding cakes and dessert tables that are as beautiful as they are delicious, using the finest ingredients and artistic designs.',
    tags: ['Custom Cakes', 'Dessert Tables', 'Eggless Options', 'Themed Designs']
  },
  {
    id: '9',
    name: 'Saree Couture',
    category: 'Bridal Wear',
    location: 'Chandni Chowk, Delhi',
    image: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7',
    rating: 4.9,
    startingPrice: 'From ₹50,000',
    email: 'appointments@sareecouture.com',
    phone: '+91-11-2345-1234',
    description: 'Saree Couture offers exquisite bridal lehengas, sarees, and gowns, combining traditional craftsmanship with contemporary designs for the modern Indian bride.',
    tags: ['Bridal Lehengas', 'Designer Sarees', 'Custom Designs', 'Heritage Crafts']
  },
  {
    id: '10',
    name: 'Dhol Baaje',
    category: 'Traditional Music',
    location: 'Dwarka, New Delhi',
    image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae',
    rating: 4.7,
    startingPrice: 'From ₹25,000',
    email: 'bookings@dholbaaje.com',
    phone: '+91-99876-12345',
    description: 'Dhol Baaje brings traditional North Indian wedding music to life with energetic dhol players, nagada, shehnai, and folk musicians for a vibrant baraat and ceremonies.',
    tags: ['Dhol Players', 'Folk Music', 'Baraat', 'Traditional']
  },
  {
    id: '11',
    name: 'Noida Tent House',
    category: 'Decor & Tenting',
    location: 'Sector 18, Noida',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rating: 4.6,
    startingPrice: 'From ₹1,50,000',
    email: 'info@noidatenthouse.com',
    phone: '+91-120-456-7890',
    description: 'Noida Tent House provides comprehensive decor solutions including tent structures, stage setups, lighting arrangements, and themed decorations for all wedding functions.',
    tags: ['Tenting', 'Theme Decor', 'Lighting', 'Stage Design']
  },
  {
    id: '12',
    name: 'Invites & More',
    category: 'Invitations',
    location: 'Lajpat Nagar, Delhi',
    image: 'https://images.unsplash.com/photo-1515001621567-98069a800a67',
    rating: 4.8,
    startingPrice: 'From ₹150 per card',
    email: 'orders@invitesandmore.in',
    phone: '+91-98765-09876',
    description: 'Invites & More creates bespoke wedding invitations, from traditional cards with intricate designs to modern digital invitations with multimedia elements.',
    tags: ['Custom Invitations', 'Digital Invites', 'Luxury Cards', 'Packaging']
  }
];

// Filter and search utilities
export const filterVenuesByCity = (city: string) => {
  if (city === 'all') return FEATURED_VENUES;
  return FEATURED_VENUES.filter(v => 
    v.location.toLowerCase().includes(city.toLowerCase()) ||
    v.city?.toLowerCase() === city.toLowerCase()
  );
};

export const filterVenuesByCapacity = (minCapacity: number, maxCapacity: number) => {
  return FEATURED_VENUES.filter(v => 
    v.capacity.max >= minCapacity && v.capacity.min <= maxCapacity
  );
};

export const filterVenuesByRating = (minRating: number) => {
  return FEATURED_VENUES.filter(v => v.rating >= minRating);
};

export const searchVenues = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return FEATURED_VENUES.filter(v =>
    v.name.toLowerCase().includes(lowerQuery) ||
    v.description.toLowerCase().includes(lowerQuery) ||
    v.location.toLowerCase().includes(lowerQuery) ||
    v.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getVenueCities = () => {
  const cities = FEATURED_VENUES.map(v => {
    if (v.city) return v.city;
    // Extract city from location string
    const parts = v.location.split(',');
    return parts[parts.length - 1].trim();
  });
  return Array.from(new Set(cities));
};

export const getVenueTags = () => {
  const allTags = FEATURED_VENUES.flatMap(v => v.tags);
  return Array.from(new Set(allTags));
};
