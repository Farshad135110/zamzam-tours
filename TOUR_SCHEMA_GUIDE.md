# How to Add Tour Schema to Individual Tour Pages

## Quick Guide

When creating individual tour detail pages (e.g., `/tours/cultural-triangle`), add the `TourSchema` component to enable rich search results for that specific tour.

---

## Example Usage

```tsx
import TourSchema from '../../components/SEO/TourSchema';

export default function TourDetailPage() {
  const tour = {
    id: 'cultural-triangle',
    name: 'Cultural Triangle Tour',
    description: 'Explore ancient temples and UNESCO World Heritage Sites including Sigiriya, Dambulla, and Polonnaruwa.',
    duration: '5 days',
    price: 1200,
    image: 'https://zamzamlankatours.com/images/cultural-triangle.jpg',
    highlights: [
      'Sigiriya Rock Fortress',
      'Dambulla Cave Temple',
      'Polonnaruwa Ancient City',
      'Minneriya National Park Safari'
    ],
    included: [
      'Accommodation',
      'Professional guide',
      'Transportation',
      'Entrance fees',
      'Daily breakfast'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Colombo to Sigiriya',
        description: 'Transfer from Colombo to Sigiriya, visit Dambulla Cave Temple',
        activities: ['Dambulla Cave Temple', 'Check-in at Sigiriya hotel']
      },
      {
        day: 2,
        title: 'Sigiriya Rock Fortress',
        description: 'Climb the iconic Sigiriya Rock and explore ancient frescoes',
        activities: ['Sigiriya Rock climb', 'Sigiriya Museum', 'Village tour']
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Cultural Triangle Tour - 5 Days | ZamZam Lanka Tours</title>
        <meta name="description" content={tour.description} />
        <link rel="canonical" href="https://zamzamlankatours.com/tours/cultural-triangle" />
      </Head>

      {/* Add Tour Schema */}
      <TourSchema 
        tour={tour}
        url="https://zamzamlankatours.com/tours/cultural-triangle"
      />

      {/* Page content... */}
    </>
  );
}
```

---

## Schema Properties

### Required
- **name**: Tour package name
- **description**: Detailed tour description
- **duration**: Tour length (e.g., "5 days", "7 days 6 nights")

### Optional (but recommended)
- **id**: Unique identifier for the tour
- **price**: Tour price in USD
- **image**: Main tour image URL
- **highlights**: Array of tour highlights
- **included**: Array of what's included in the package
- **itinerary**: Day-by-day breakdown with activities

---

## Benefits

When you add TourSchema to tour pages, Google can display:
- ✅ **Price** directly in search results
- ✅ **Duration** of the tour
- ✅ **Tour highlights** as bullet points
- ✅ **Provider information** (ZamZam Lanka Tours)
- ✅ **Rich snippets** with images
- ✅ **"Book now" actions** in search
- ✅ **Itinerary preview** in Google Travel

---

## SEO Impact

### Search Result Example
```
Cultural Triangle Tour - 5 Days | ZamZam Lanka Tours
https://zamzamlankatours.com/tours/cultural-triangle
★★★★★ 4.8 (150 reviews) · $1,200
5 days · Tour Operator · Sri Lanka
Explore ancient temples and UNESCO sites. Includes Sigiriya, 
Dambulla, Polonnaruwa. Professional guide, accommodation included.
```

---

## Best Practices

1. **Unique Descriptions**: Each tour should have a unique, detailed description (150+ words)
2. **High-Quality Images**: Use landscape images (1200x800px minimum)
3. **Accurate Pricing**: Keep prices up-to-date
4. **Detailed Itinerary**: More detail = better rankings
5. **Include Reviews**: Add review schema when you have testimonials

---

## Integration with Existing Tours

For tours fetched from the database (API), map the data like this:

```tsx
const tour = {
  id: dbTour.package_id,
  name: dbTour.package_name,
  description: dbTour.description,
  duration: `${dbTour.days} days`,
  price: parseFloat(dbTour.price),
  image: dbTour.image,
  highlights: dbTour.highlights.split(',').map(h => h.trim()),
  included: dbTour.includings.split(',').map(i => i.trim()),
  itinerary: dbTour.itinerary // if available in database
};
```

---

## Testing

After adding Tour Schema, test it:

1. **Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Validator**: https://validator.schema.org/
3. **Google Search Console**: Check "Enhancements" > "Unparsed Structured Data"

---

## Example Output (JSON-LD)

The TourSchema component generates JSON-LD like this:

```json
{
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  "@id": "https://zamzamlankatours.com/tours/cultural-triangle",
  "name": "Cultural Triangle Tour",
  "description": "Explore ancient temples...",
  "url": "https://zamzamlankatours.com/tours/cultural-triangle",
  "image": "https://zamzamlankatours.com/images/cultural-triangle.jpg",
  "touristType": "International and Domestic Travelers",
  "provider": {
    "@type": "TravelAgency",
    "@id": "https://zamzamlankatours.com/#organization",
    "name": "ZamZam Lanka Tours"
  },
  "duration": "5 days",
  "offers": {
    "@type": "Offer",
    "price": "1200",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "itinerary": {
    "@type": "ItemList",
    "itemListElement": [...]
  }
}
```

---

## Next Steps

1. Create individual tour detail pages for your top packages
2. Add TourSchema to each page
3. Test with Rich Results Test tool
4. Submit updated sitemap to Google Search Console
5. Monitor search performance in Search Console

**Questions?** Check the `/components/SEO/TourSchema.tsx` file for the full implementation.
