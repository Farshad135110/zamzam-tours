// components/SEO/ServiceSchema.tsx
import React from 'react';

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string[];
  provider?: string;
}

const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  name,
  description,
  serviceType,
  areaServed = ["Sri Lanka"],
  provider = "Zamzam Lanka Tours"
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceType,
    "name": name,
    "description": description,
    "provider": {
      "@type": "TourOperator",
      "name": provider,
      "@id": "https://www.zamzamlankatours.com/#organization"
    },
    "areaServed": areaServed.map(area => ({
      "@type": "Place",
      "name": area
    })),
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://www.zamzamlankatours.com",
      "servicePhone": "+94 XX XXX XXXX",
      "availableLanguage": ["English", "German", "French"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ServiceSchema;
