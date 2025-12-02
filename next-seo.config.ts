// next-seo.config.ts
import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  defaultTitle: 'Zamzam Lanka Tours | Sri Lanka Tours, Car Rentals & Airport Transfers',
  titleTemplate: '%s | Zamzam Lanka Tours',
  description: 'Explore Sri Lanka with Zamzam Lanka Tours. Professional tour packages, car rentals, airport transfers, and travel services across Colombo, Kandy, Ella, Sigiriya & beyond. Book your adventure today!',
  canonical: 'https://www.zamzamlankatours.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.zamzamlankatours.com',
    siteName: 'Zamzam Lanka Tours',
    title: 'Zamzam Lanka Tours | Sri Lanka Tours, Car Rentals & Airport Transfers',
    description: 'Explore Sri Lanka with Zamzam Lanka Tours. Professional tour packages, car rentals, airport transfers, and travel services across Colombo, Kandy, Ella, Sigiriya & beyond.',
    images: [
      {
        url: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761564719/zamzam-tours/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zamzam Lanka Tours - Explore Sri Lanka',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@zamzamlankatours',
    site: '@zamzamlankatours',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Sri Lanka tours, car rental Sri Lanka, airport transfer Colombo, Sri Lanka travel, Kandy tours, Ella tours, Sigiriya tours, wildlife safari Sri Lanka, beach tours, cultural tours, Ceylon tours, Sri Lanka vacation packages',
    },
    {
      name: 'author',
      content: 'Zamzam Lanka Tours',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'theme-color',
      content: '#053b3c',
    },
    {
      name: 'msapplication-TileColor',
      content: '#053b3c',
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {
      name: 'googlebot',
      content: 'index, follow',
    },
    {
      name: 'geo.region',
      content: 'LK',
    },
    {
      name: 'geo.placename',
      content: 'Sri Lanka',
    },
    {
      name: 'geo.position',
      content: '6.9271;79.8612',
    },
    {
      name: 'ICBM',
      content: '6.9271, 79.8612',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};

export default config;
