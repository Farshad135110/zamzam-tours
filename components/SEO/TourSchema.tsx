// components/SEO/TourSchema.tsx
import React from 'react';
import Head from 'next/head';
import { CONTACT_INFO } from '../../src/constants/config';

interface TourSchemaProps {
  tour: {
    id?: number | string;
    name: string;
    description: string;
    duration: string;
    price?: number;
    image?: string;
    highlights?: string[];
    included?: string[];
    itinerary?: Array<{
      day: number;
      title: string;
      description: string;
      activities: string[];
    }>;
  };
  url?: string;
}

const TourSchema: React.FC<TourSchemaProps> = ({ tour, url }) => {
  const tourUrl = url || `https://zamzamlankatours.com/tours/${tour.id || tour.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": tourUrl,
    "name": tour.name,
    "description": tour.description,
    "url": tourUrl,
    "image": tour.image || "https://zamzamlankatours.com/images/tour-default.jpg",
    "touristType": "International and Domestic Travelers",
    "provider": {
      "@type": "TravelAgency",
      "@id": "https://zamzamlankatours.com/#organization",
      "name": "ZamZam Lanka Tours",
      "url": "https://zamzamlankatours.com",
      "telephone": CONTACT_INFO.phone,
      "email": CONTACT_INFO.email
    },
    "duration": tour.duration,
    ...(tour.price && {
      "offers": {
        "@type": "Offer",
        "price": tour.price.toString(),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString().split('T')[0],
        "url": tourUrl,
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "seller": {
          "@type": "TravelAgency",
          "name": "ZamZam Lanka Tours"
        }
      }
    }),
    ...(tour.itinerary && tour.itinerary.length > 0 && {
      "itinerary": {
        "@type": "ItemList",
        "itemListElement": tour.itinerary.map((day, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": day.title,
          "description": day.description,
          "item": {
            "@type": "TouristDestination",
            "name": day.title
          }
        }))
      }
    }),
    ...(tour.highlights && tour.highlights.length > 0 && {
      "subjectOf": {
        "@type": "ItemList",
        "name": "Tour Highlights",
        "itemListElement": tour.highlights.map((highlight, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": highlight
        }))
      }
    }),
    ...(tour.included && tour.included.length > 0 && {
      "includesObject": tour.included.map(item => ({
        "@type": "Service",
        "name": item
      }))
    }),
    "inLanguage": "en",
    "locationCreated": {
      "@type": "Country",
      "name": "Sri Lanka"
    }
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

export default TourSchema;
