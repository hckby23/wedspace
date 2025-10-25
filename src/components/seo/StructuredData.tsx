"use client";

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
  id?: string;
}

export function StructuredData({ data, id }: StructuredDataProps) {
  useEffect(() => {
    // Create script element for structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id || `structured-data-${Date.now()}`;
    script.textContent = JSON.stringify(Array.isArray(data) ? data : [data]);
    
    // Add to head
    document.head.appendChild(script);
    
    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(script.id);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [data, id]);

  return null;
}

// Organization structured data
export function OrganizationStructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WedSpace',
    url: 'https://wedspace.in',
    logo: 'https://wedspace.in/img/logo.png',
    description: 'India\'s leading AI-powered wedding planning platform',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi']
    },
    sameAs: [
      'https://facebook.com/wedspace',
      'https://instagram.com/wedspace',
      'https://twitter.com/wedspace',
      'https://linkedin.com/company/wedspace'
    ],
    foundingDate: '2024',
    numberOfEmployees: '50-100',
    industry: 'Wedding Planning Services',
    serviceArea: {
      '@type': 'Country',
      name: 'India'
    }
  };

  return <StructuredData data={organizationData} id="organization-data" />;
}

// Website structured data
export function WebsiteStructuredData() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WedSpace',
    url: 'https://wedspace.in',
    description: 'Find perfect wedding venues and vendors with AI-powered recommendations',
    publisher: {
      '@type': 'Organization',
      name: 'WedSpace'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://wedspace.in/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Wedding Services',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: 'Wedding Venues',
            url: 'https://wedspace.in/venues'
          }
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Wedding Vendors',
            url: 'https://wedspace.in/vendors'
          }
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Wedding Planning Tools',
            url: 'https://wedspace.in/planning'
          }
        }
      ]
    }
  };

  return <StructuredData data={websiteData} id="website-data" />;
}

// Service structured data for wedding planning
export function WeddingServiceStructuredData() {
  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI-Powered Wedding Planning',
    description: 'Complete wedding planning solution with venue booking, vendor selection, and smart recommendations',
    provider: {
      '@type': 'Organization',
      name: 'WedSpace',
      url: 'https://wedspace.in'
    },
    serviceType: 'Wedding Planning',
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Wedding Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Venue Booking',
            description: 'Find and book perfect wedding venues'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Vendor Selection',
            description: 'Connect with verified wedding vendors'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Wedding Planning Tools',
            description: 'Budget tracking, guest management, and timeline planning'
          }
        }
      ]
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Couples planning their wedding'
    }
  };

  return <StructuredData data={serviceData} id="service-data" />;
}

// Local business structured data for venues
export function VenueLocalBusinessData({ venue }: {
  venue: {
    id: string;
    name: string;
    description?: string;
    location: string;
    address?: string;
    phone?: string;
    email?: string;
    images?: string[];
    capacity?: number;
    amenities?: string[];
    rating?: number;
    reviewCount?: number;
    price?: number;
  }
}) {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    '@id': `https://wedspace.in/venues/${venue.id}`,
    name: venue.name,
    description: venue.description,
    image: venue.images,
    address: {
      '@type': 'PostalAddress',
      addressLocality: venue.location,
      addressCountry: 'IN',
      streetAddress: venue.address
    },
    telephone: venue.phone,
    email: venue.email,
    url: `https://wedspace.in/venues/${venue.id}`,
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
    priceRange: venue.price ? `₹${venue.price.toLocaleString('en-IN')}+` : undefined,
    geo: {
      '@type': 'GeoCoordinates',
      addressCountry: 'IN'
    },
    openingHours: 'Mo-Su 09:00-22:00',
    paymentAccepted: ['Cash', 'Credit Card', 'UPI', 'Net Banking'],
    currenciesAccepted: 'INR'
  };

  return <StructuredData data={localBusinessData} id={`venue-${venue.id}`} />;
}

// Product structured data for vendor services
export function VendorServiceData({ vendor }: {
  vendor: {
    id: string;
    name: string;
    category: string;
    description?: string;
    location: string;
    services?: string[];
    rating?: number;
    reviewCount?: number;
    experience?: number;
    images?: string[];
  }
}) {
  const vendorData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://wedspace.in/vendors/${vendor.id}`,
    name: vendor.name,
    description: vendor.description,
    image: vendor.images,
    address: {
      '@type': 'PostalAddress',
      addressLocality: vendor.location,
      addressCountry: 'IN'
    },
    url: `https://wedspace.in/vendors/${vendor.id}`,
    serviceType: vendor.category,
    areaServed: {
      '@type': 'City',
      name: vendor.location
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${vendor.category} Services`,
      itemListElement: vendor.services?.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service,
          category: vendor.category
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
    foundingDate: vendor.experience ? new Date().getFullYear() - vendor.experience : undefined,
    paymentAccepted: ['Cash', 'Credit Card', 'UPI', 'Net Banking'],
    currenciesAccepted: 'INR'
  };

  return <StructuredData data={vendorData} id={`vendor-${vendor.id}`} />;
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ items }: {
  items: Array<{ name: string; url: string }>
}) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return <StructuredData data={breadcrumbData} id="breadcrumb-data" />;
}

// FAQ structured data
export function FAQStructuredData({ faqs }: {
  faqs: Array<{ question: string; answer: string }>
}) {
  const faqData = {
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

  return <StructuredData data={faqData} id="faq-data" />;
}

// Review structured data
export function ReviewStructuredData({ reviews, itemName, itemType }: {
  reviews: Array<{
    rating: number;
    comment: string;
    author: string;
    date: string;
  }>;
  itemName: string;
  itemType: 'venue' | 'vendor';
}) {
  const reviewData = reviews.map((review, index) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `review-${index}`,
    itemReviewed: {
      '@type': itemType === 'venue' ? 'EventVenue' : 'LocalBusiness',
      name: itemName
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    },
    reviewBody: review.comment,
    author: {
      '@type': 'Person',
      name: review.author
    },
    datePublished: review.date
  }));

  return <StructuredData data={reviewData} id="reviews-data" />;
}

// Event structured data for weddings
export function WeddingEventStructuredData({ event }: {
  event: {
    name: string;
    date: string;
    venue: string;
    location: string;
    description?: string;
  }
}) {
  const eventData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description || `Wedding celebration at ${event.venue}`,
    startDate: event.date,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location,
        addressCountry: 'IN'
      }
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: {
      '@type': 'Organization',
      name: 'WedSpace',
      url: 'https://wedspace.in'
    }
  };

  return <StructuredData data={eventData} id="wedding-event-data" />;
}
