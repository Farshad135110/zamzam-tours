// components/SEO/OrganizationSchema.tsx
import React from 'react';
import Head from 'next/head';
import { CONTACT_INFO } from '../../src/constants/config';

interface OrganizationSchemaProps {
  includeSameAs?: string[];
}

const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({ 
  includeSameAs = [] 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://zamzamlankatours.com/#organization",
    "name": "ZamZam Lanka Tours",
    "alternateName": "ZamZam Tours Sri Lanka",
    "url": "https://zamzamlankatours.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://zamzamlankatours.com/logo.png",
      "width": 250,
      "height": 60
    },
    "image": "https://zamzamlankatours.com/images/og-image.jpg",
    "description": "Premium travel agency in Sri Lanka offering tour packages, private drivers, car rentals, airport transfers, and custom holiday itineraries across the island.",
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Galle Road",
      "addressLocality": "Colombo",
      "addressRegion": "Western Province",
      "postalCode": "00300",
      "addressCountry": "LK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "areaServed": {
      "@type": "Country",
      "name": "Sri Lanka"
    },
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "sameAs": [
      "https://facebook.com/zamzamlankatours",
      "https://instagram.com/zamzamlankatours",
      ...includeSameAs
    ].filter(Boolean),
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": CONTACT_INFO.phone,
        "contactType": "customer service",
        "availableLanguage": ["English", "Sinhala", "Tamil"],
        "areaServed": "LK"
      },
      {
        "@type": "ContactPoint",
        "telephone": CONTACT_INFO.whatsapp,
        "contactType": "customer service",
        "contactOption": "TollFree",
        "availableLanguage": ["English", "Sinhala", "Tamil"]
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Travel Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Tour Packages",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TouristTrip",
                "name": "Cultural Triangle Tours",
                "description": "Explore ancient temples and UNESCO World Heritage Sites"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TouristTrip",
                "name": "Wildlife Safari Tours",
                "description": "Experience Sri Lanka's incredible wildlife in national parks"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "TouristTrip",
                "name": "Hill Country Tours",
                "description": "Discover tea plantations and mountain landscapes"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Vehicle Rentals",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Self-Drive Car Rental",
                "description": "Modern vehicles for independent exploration"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Car Rental with Driver",
                "description": "Comfortable vehicles with experienced drivers"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Transfer Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Airport Transfer",
                "description": "Reliable pickup and drop-off from all Sri Lankan airports"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "All-Island Transfers",
                "description": "Comfortable transportation to any destination in Sri Lanka"
              }
            }
          ]
        }
      ]
    },
    "knowsAbout": [
      "Sri Lanka Tourism",
      "Tour Packages",
      "Car Rental",
      "Airport Transfers",
      "Wildlife Safaris",
      "Cultural Tours",
      "Beach Holidays",
      "Adventure Travel"
    ],
    "slogan": "Discover Sri Lanka with Expert Local Guidance"
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};

export default OrganizationSchema;
