'use client';

import Head from 'next/head';
import { BRAND_CONFIG } from '@/lib/branding';

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BRAND_CONFIG.business.name,
    "alternateName": BRAND_CONFIG.name,
    "url": BRAND_CONFIG.social.website,
    "logo": `${BRAND_CONFIG.social.website}/icons/icon-512x512.svg`,
    "description": BRAND_CONFIG.description,
    "foundingDate": BRAND_CONFIG.business.founded,
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": BRAND_CONFIG.contact.phone,
        "contactType": "Customer Service",
        "email": BRAND_CONFIG.contact.email,
        "availableLanguage": ["English"],
        "areaServed": "US"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BRAND_CONFIG.contact.address.split(',')[0],
      "addressLocality": "Health City",
      "addressRegion": "HC",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "sameAs": [
      `https://twitter.com/${BRAND_CONFIG.social.twitter.replace('@', '')}`,
      `https://facebook.com/${BRAND_CONFIG.social.facebook}`,
      `https://instagram.com/${BRAND_CONFIG.social.instagram.replace('@', '')}`,
      `https://linkedin.com/${BRAND_CONFIG.social.linkedin}`
    ],
    "knowsAbout": [
      "Nutrition Counseling",
      "Diet Planning",
      "Weight Management",
      "Healthy Eating",
      "Nutritional Analysis",
      "Meal Planning",
      "Wellness Coaching"
    ]
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "NutritionInformation",
    "name": BRAND_CONFIG.business.name,
    "image": `${BRAND_CONFIG.social.website}/icons/icon-512x512.svg`,
    "description": BRAND_CONFIG.description,
    "provider": {
      "@type": "Organization",
      "name": BRAND_CONFIG.business.name,
      "url": BRAND_CONFIG.social.website
    },
    "serviceType": "Nutrition Counseling",
    "areaServed": "United States",
    "availableLanguage": "English"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": BRAND_CONFIG.name,
    "url": BRAND_CONFIG.social.website,
    "description": BRAND_CONFIG.description,
    "publisher": {
      "@type": "Organization",
      "name": BRAND_CONFIG.business.name
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BRAND_CONFIG.social.website}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": BRAND_CONFIG.name,
    "operatingSystem": "Web Browser",
    "applicationCategory": "HealthApplication",
    "description": BRAND_CONFIG.description,
    "url": BRAND_CONFIG.social.website,
    "author": {
      "@type": "Organization",
      "name": BRAND_CONFIG.business.name
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Personalized Nutrition Plans",
      "Expert Dietitian Consultations", 
      "Progress Tracking",
      "Meal Planning",
      "Nutritional Analysis",
      "Health Goal Setting"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Nutrition Counseling Services",
    "description": "Professional nutrition counseling and personalized diet planning services",
    "provider": {
      "@type": "Organization",
      "name": BRAND_CONFIG.business.name,
      "url": BRAND_CONFIG.social.website
    },
    "serviceType": "Nutrition Counseling",
    "areaServed": "United States",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Nutrition Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "One-on-One Nutrition Consultation",
            "description": "Personal consultations with certified dietitians"
          },
          "price": "75",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Personalized Meal Planning",
            "description": "Custom meal plans designed for your specific goals"
          },
          "price": "29",
          "priceCurrency": "USD"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema)
        }}
      />
    </>
  );
}