import { Metadata } from 'next';

// Base SEO configuration
export const siteConfig = {
  name: 'WedSpace',
  description: 'India\'s leading AI-powered wedding planning platform. Find perfect venues, vendors, and plan your dream wedding with smart recommendations.',
  url: 'https://wedspace.in',
  ogImage: '/img/og-image.jpg',
  creator: '@wedspace',
  keywords: [
    'wedding planning',
    'wedding venues',
    'wedding vendors',
    'marriage halls',
    'wedding photography',
    'wedding decorators',
    'wedding caterers',
    'destination weddings',
    'Indian weddings',
    'wedding planners',
    'AI wedding planning',
    'smart wedding recommendations'
  ]
};

// Generate metadata for pages
export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  noIndex = false
}: {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const metaTitle = title.includes('WedSpace') ? title : `${title} | WedSpace`;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url || siteConfig.url;
  const allKeywords = [...siteConfig.keywords, ...(keywords || [])];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'WedSpace Team' }],
    creator: siteConfig.creator,
    publisher: 'WedSpace',
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      type,
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle
        }
      ],
      locale: 'en_IN',
      countryName: 'India'
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.creator
    },
    alternates: {
      canonical: metaUrl
    },
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || ''
    }
  };
}

// Venue-specific metadata
export function generateVenueMetadata(venue: {
  id: string;
  name: string;
  location: string;
  description?: string;
  images?: string[];
  price?: number;
  capacity?: number;
  amenities?: string[];
}) {
  const title = `${venue.name} - Wedding Venue in ${venue.location}`;
  const description = venue.description || 
    `Book ${venue.name} for your wedding in ${venue.location}. ${venue.capacity ? `Capacity: ${venue.capacity} guests. ` : ''}${venue.price ? `Starting from ₹${venue.price.toLocaleString('en-IN')}. ` : ''}Premium wedding venue with modern amenities.`;
  
  const keywords = [
    venue.name.toLowerCase(),
    `wedding venue ${venue.location.toLowerCase()}`,
    `marriage hall ${venue.location.toLowerCase()}`,
    `banquet hall ${venue.location.toLowerCase()}`,
    ...(venue.amenities || []).map(a => a.toLowerCase())
  ];

  return generateMetadata({
    title,
    description,
    image: venue.images?.[0],
    url: `${siteConfig.url}/venues/${venue.id}`,
    keywords
  });
}

// Vendor-specific metadata
export function generateVendorMetadata(vendor: {
  id: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  images?: string[];
  services?: string[];
  experience?: number;
}) {
  const title = `${vendor.name} - ${vendor.category} in ${vendor.location}`;
  const description = vendor.description || 
    `Hire ${vendor.name} for ${vendor.category.toLowerCase()} services in ${vendor.location}. ${vendor.experience ? `${vendor.experience}+ years experience. ` : ''}Professional wedding services with excellent reviews.`;
  
  const keywords = [
    vendor.name.toLowerCase(),
    `${vendor.category.toLowerCase()} ${vendor.location.toLowerCase()}`,
    `wedding ${vendor.category.toLowerCase()}`,
    ...(vendor.services || []).map(s => s.toLowerCase())
  ];

  return generateMetadata({
    title,
    description,
    image: vendor.images?.[0],
    url: `${siteConfig.url}/vendors/${vendor.id}`,
    keywords
  });
}

// Location-based metadata
export function generateLocationMetadata(location: string, type: 'venues' | 'vendors') {
  const title = `Wedding ${type} in ${location} - Best ${type} for Your Wedding`;
  const description = `Find the best wedding ${type} in ${location}. Compare prices, read reviews, and book directly. Verified ${type} with transparent pricing and instant availability.`;
  
  const keywords = [
    `wedding ${type} ${location.toLowerCase()}`,
    `${location.toLowerCase()} wedding ${type}`,
    `marriage ${type} ${location.toLowerCase()}`,
    `best wedding ${type} ${location.toLowerCase()}`
  ];

  return generateMetadata({
    title,
    description,
    url: `${siteConfig.url}/${type}?location=${encodeURIComponent(location)}`,
    keywords
  });
}

// Structured data generators
export function generateVenueStructuredData(venue: {
  id: string;
  name: string;
  description?: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  price?: number;
  capacity?: number;
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: venue.name,
    description: venue.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: venue.location,
      addressCountry: 'IN'
    },
    telephone: venue.phone,
    email: venue.email,
    url: venue.website || `${siteConfig.url}/venues/${venue.id}`,
    image: venue.images,
    maximumAttendeeCapacity: venue.capacity,
    amenityFeature: venue.amenities?.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity
    })),
    aggregateRating: venue.rating && venue.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: venue.rating,
      reviewCount: venue.reviewCount,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    priceRange: venue.price ? `₹${venue.price.toLocaleString('en-IN')}+` : undefined
  };
}

export function generateVendorStructuredData(vendor: {
  id: string;
  name: string;
  category: string;
  description?: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  services?: string[];
  rating?: number;
  reviewCount?: number;
  experience?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/vendors/${vendor.id}`,
    name: vendor.name,
    description: vendor.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: vendor.location,
      addressCountry: 'IN'
    },
    telephone: vendor.phone,
    email: vendor.email,
    url: vendor.website || `${siteConfig.url}/vendors/${vendor.id}`,
    image: vendor.images,
    serviceType: vendor.category,
    areaServed: {
      '@type': 'City',
      name: vendor.location
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${vendor.category} Services`,
      itemListElement: vendor.services?.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service
        }
      }))
    },
    aggregateRating: vendor.rating && vendor.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating,
      reviewCount: vendor.reviewCount,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    foundingDate: vendor.experience ? new Date().getFullYear() - vendor.experience : undefined
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// SEO utilities
export function generateCanonicalUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path, siteConfig.url);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

export function generateHrefLang(path: string) {
  return [
    { hrefLang: 'en-IN', href: `${siteConfig.url}${path}` },
    { hrefLang: 'hi-IN', href: `${siteConfig.url}/hi${path}` },
    { hrefLang: 'x-default', href: `${siteConfig.url}${path}` }
  ];
}

// Indian cities for location-based SEO
export const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
  'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubballi-Dharwad'
];

// Wedding-specific keywords for different categories
export const weddingKeywords = {
  venues: [
    'wedding venues', 'marriage halls', 'banquet halls', 'wedding halls', 'reception venues',
    'destination wedding venues', 'outdoor wedding venues', 'palace weddings', 'resort weddings',
    'farmhouse weddings', 'hotel weddings', 'convention centers', 'wedding lawns'
  ],
  vendors: {
    photography: ['wedding photographers', 'pre-wedding photography', 'candid photography', 'wedding videography'],
    catering: ['wedding caterers', 'wedding food', 'catering services', 'wedding menu'],
    decoration: ['wedding decorators', 'mandap decoration', 'floral decoration', 'wedding themes'],
    music: ['wedding DJs', 'wedding bands', 'sangeet music', 'wedding entertainment'],
    makeup: ['bridal makeup', 'wedding makeup artist', 'hair styling', 'mehendi artists'],
    planning: ['wedding planners', 'wedding coordinators', 'event management', 'wedding consultants']
  }
};
