// components/SEO/LocalBusinessSchema.tsx
import { CONTACT_INFO } from '../../src/constants/config';

interface LocalBusinessSchemaProps {
  pageName?: string;
}

const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ pageName }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["TourOperator", "LocalBusiness", "TravelAgency"],
    "@id": "https://www.zamzamlankatours.com/#organization",
    "name": "Zamzam Lanka Tours",
    "alternateName": "Zamzam Tours Sri Lanka",
    "description": "Premier tour operator in Sri Lanka offering car rentals, airport transfers, guided tours, and travel services across Colombo, Kandy, Ella, Sigiriya, and all major destinations.",
    "url": "https://www.zamzamlankatours.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://res.cloudinary.com/dhqhxma30/image/upload/v1769571998/zamzamlankatourslogonewcropped_knodzl.png",
      "width": "250",
      "height": "60"
    },
    "image": [
      "https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761564719/zamzam-tours/heroes/sri-lanka-tours.jpg",
      "https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761564719/zamzam-tours/vehicles/fleet.jpg",
      "https://res.cloudinary.com/dhfqwwxyb4/image/upload/v1761564719/zamzam-tours/activities/safari.jpg"
    ],
    "telephone": CONTACT_INFO.phone,
    "email": CONTACT_INFO.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CONTACT_INFO.address,
      "addressLocality": "Colombo",
      "addressCountry": "LK",
      "addressRegion": "Western Province"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.9271",
      "longitude": "79.8612"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "Sri Lanka"
      },
      {
        "@type": "City",
        "name": "Colombo"
      },
      {
        "@type": "City",
        "name": "Kandy"
      },
      {
        "@type": "City",
        "name": "Ella"
      },
      {
        "@type": "City",
        "name": "Sigiriya"
      },
      {
        "@type": "City",
        "name": "Galle"
      },
      {
        "@type": "City",
        "name": "Nuwara Eliya"
      }
    ],
    "priceRange": "$$",
    "currenciesAccepted": "USD, EUR, LKR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "openingHours": "Mo-Su 00:00-24:00",
    "availableLanguage": ["English", "German", "French", "Spanish", "Italian", "Sinhala"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Travel Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Car Rental Services",
            "description": "Self-drive and chauffeur-driven car rental services across Sri Lanka",
            "serviceType": "Vehicle Rental"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Transfer Services",
            "description": "Reliable airport pickup and drop-off services from all major airports in Sri Lanka",
            "serviceType": "Airport Transportation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "TouristTrip",
            "name": "Guided Tours",
            "description": "Professional guided tours to cultural sites, wildlife safaris, and scenic destinations",
            "serviceType": "Tour Guide Services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "All-Island Transfers",
            "description": "Door-to-door transfer services to any destination in Sri Lanka",
            "serviceType": "Ground Transportation"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://facebook.com/zamzamlankatours",
      "https://instagram.com/zamzamlankatours",
      "https://www.tiktok.com/@zam.zam.tours.ren",
      "https://wa.me/" + CONTACT_INFO.whatsapp
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default LocalBusinessSchema;
