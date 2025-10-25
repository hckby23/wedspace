"use client";

import Head from 'next/head';
import { useRouter } from 'next/router';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  alternates?: Array<{ hrefLang: string; href: string }>;
  structuredData?: Record<string, any>;
}

export function MetaTags({
  title = 'WedSpace - Find Perfect Wedding Venues & Vendors in India',
  description = 'Discover and book the best wedding venues and vendors across India. Compare prices, read reviews, and plan your perfect wedding with WedSpace.',
  keywords = 'wedding venues, wedding vendors, wedding planning, marriage halls, banquet halls, wedding photographers, wedding decorators, India',
  image = '/img/og-image.jpg',
  url,
  type = 'website',
  siteName = 'WedSpace',
  locale = 'en_IN',
  author = 'WedSpace Team',
  publishedTime,
  modifiedTime,
  section,
  tags,
  noIndex = false,
  noFollow = false,
  canonical,
  alternates,
  structuredData
}: MetaTagsProps) {
  const router = useRouter();
  const currentUrl = url || `https://wedspace.in${router.asPath}`;
  const canonicalUrl = canonical || currentUrl;
  const ogImage = image.startsWith('http') ? image : `https://wedspace.in${image}`;

  // Generate structured data
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://wedspace.in",
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://wedspace.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.facebook.com/wedspace",
      "https://www.instagram.com/wedspace",
      "https://twitter.com/wedspace",
      "https://www.linkedin.com/company/wedspace"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#dc2626" />
      
      {/* Robots Meta Tags */}
      <meta 
        name="robots" 
        content={`${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`} 
      />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Languages */}
      {alternates?.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags?.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@wedspace" />
      <meta name="twitter:creator" content="@wedspace" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags for Indian Market */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />
      <meta name="language" content="English" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://maps.googleapis.com" />
      <link rel="preconnect" href="https://checkout.razorpay.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//maps.googleapis.com" />
      <link rel="dns-prefetch" href="//checkout.razorpay.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
    </Head>
  );
}

// Predefined meta configurations for common pages
export const metaConfigs = {
  home: {
    title: 'WedSpace - Find Perfect Wedding Venues & Vendors in India',
    description: 'Discover and book the best wedding venues and vendors across India. Compare prices, read reviews, and plan your perfect wedding with WedSpace.',
    keywords: 'wedding venues India, wedding vendors, marriage halls, banquet halls, wedding planning, destination weddings',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "WedSpace",
      "url": "https://wedspace.in",
      "description": "India's leading wedding venue and vendor booking platform",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://wedspace.in/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  venues: {
    title: 'Wedding Venues in India - Book Best Marriage Halls | WedSpace',
    description: 'Find and book the perfect wedding venues across India. Browse banquet halls, marriage gardens, hotels, and destination wedding locations.',
    keywords: 'wedding venues, marriage halls, banquet halls, wedding locations, destination weddings, India',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Wedding Venues in India",
      "description": "Curated list of the best wedding venues across India"
    }
  },
  
  vendors: {
    title: 'Wedding Vendors in India - Photographers, Decorators & More | WedSpace',
    description: 'Connect with top wedding vendors in India. Find photographers, decorators, caterers, makeup artists, and more for your special day.',
    keywords: 'wedding vendors, wedding photographers, wedding decorators, wedding caterers, makeup artists, wedding planners, India',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Wedding Vendors in India",
      "description": "Professional wedding service providers across India"
    }
  },
  
  about: {
    title: 'About WedSpace - India\'s Premier Wedding Planning Platform',
    description: 'Learn about WedSpace, India\'s trusted platform for finding wedding venues and vendors. Our mission is to make wedding planning simple and stress-free.',
    keywords: 'about wedspace, wedding planning platform, wedding technology, India',
    type: 'article' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WedSpace",
      "url": "https://wedspace.in",
      "logo": "https://wedspace.in/img/logo.png",
      "description": "India's leading wedding venue and vendor booking platform",
      "foundingDate": "2024",
      "founders": [
        {
          "@type": "Person",
          "name": "WedSpace Team"
        }
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    }
  },
  
  contact: {
    title: 'Contact WedSpace - Get Help with Wedding Planning',
    description: 'Get in touch with WedSpace for support, partnerships, or any questions about wedding venue and vendor bookings.',
    keywords: 'contact wedspace, wedding planning support, customer service, help',
    type: 'article' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact WedSpace",
      "description": "Get in touch with WedSpace team"
    }
  }
};

// Utility function to generate venue-specific meta tags
export function generateVenueMeta(venue: {
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  amenities: string[];
}) {
  return {
    title: `${venue.name} - Wedding Venue in ${venue.location} | WedSpace`,
    description: `Book ${venue.name} in ${venue.location}. ${venue.description} Starting from ₹${venue.price.toLocaleString()}. Rating: ${venue.rating}/5.`,
    keywords: `${venue.name}, wedding venue ${venue.location}, marriage hall ${venue.location}, ${venue.amenities.join(', ')}`,
    image: venue.images[0],
    type: 'product' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "EventVenue",
      "name": venue.name,
      "description": venue.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": venue.location,
        "addressCountry": "IN"
      },
      "image": venue.images,
      "priceRange": `₹${venue.price}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": venue.rating,
        "bestRating": 5
      },
      "amenityFeature": venue.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }))
    }
  };
}

// Utility function to generate vendor-specific meta tags
export function generateVendorMeta(vendor: {
  name: string;
  category: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  images: string[];
  services: string[];
}) {
  return {
    title: `${vendor.name} - ${vendor.category} in ${vendor.location} | WedSpace`,
    description: `Hire ${vendor.name}, professional ${vendor.category} in ${vendor.location}. ${vendor.description} Starting from ₹${vendor.price.toLocaleString()}.`,
    keywords: `${vendor.name}, ${vendor.category} ${vendor.location}, wedding ${vendor.category}, ${vendor.services.join(', ')}`,
    image: vendor.images[0],
    type: 'product' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": vendor.name,
      "description": vendor.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": vendor.location,
        "addressCountry": "IN"
      },
      "image": vendor.images,
      "priceRange": `₹${vendor.price}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": vendor.rating,
        "bestRating": 5
      },
      "serviceType": vendor.services
    }
  };
}
