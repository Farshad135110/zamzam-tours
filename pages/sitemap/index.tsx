// pages/sitemap/index.tsx - HTML Sitemap for users and SEO
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SitemapPage() {
  return (
    <>
      <Head>
        <title>Sitemap | ZamZam Lanka Tours - Sri Lanka Travel Services</title>
        <meta name="description" content="Complete sitemap of ZamZam Lanka Tours website. Find all our Sri Lanka tour packages, activities, car rentals, and travel services." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://zamzamlankatours.com/sitemap" />
      </Head>

      <Navbar />

      <div style={{ padding: '120px 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#053b3c' }}>Sitemap</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
          Browse all pages and services available on ZamZam Lanka Tours
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* Main Pages */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#053b3c', borderBottom: '2px solid #f8b500', paddingBottom: '0.5rem' }}>
              Main Pages
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🏠 Home
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/about" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  ℹ️ About Us
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/contact" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📞 Contact
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/gallery" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📸 Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Tours & Packages */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#053b3c', borderBottom: '2px solid #f8b500', paddingBottom: '0.5rem' }}>
              Tours & Packages
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/tours" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🗺️ All Tour Packages
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/tours?category=cultural" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Cultural Triangle Tours
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/tours?category=wildlife" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Wildlife Safari Tours
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/tours?category=beach" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Beach & Relaxation Tours
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/tours?category=hill-country" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Hill Country Tours
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/tours?duration=7-14" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Round Island Tours
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/contact" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Custom Itineraries
                </Link>
              </li>
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#053b3c', borderBottom: '2px solid #f8b500', paddingBottom: '0.5rem' }}>
              Activities
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/activities" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🎯 All Activities
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/activities?category=wildlife" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Wildlife Safaris (Yala, Udawalawe)
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/activities?category=marine" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Whale Watching (Mirissa)
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/activities?category=cultural" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Temple Tours (Sigiriya, Dambulla)
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/activities?category=nature" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Tea Plantation Visits
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/activities?category=adventure" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Hiking & Trekking (Ella, Adam&apos;s Peak)
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/activities?category=water-sports" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Diving & Snorkeling
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#053b3c', borderBottom: '2px solid #f8b500', paddingBottom: '0.5rem' }}>
              Services
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/car-rental" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🚗 Car Rental
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/car-rental?type=self-drive" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Self-Drive Rentals
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/car-rental?type=with-driver" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • With Driver Service
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/fleet" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Luxury Vehicles
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/airport-transfer" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  ✈️ Airport Transfers
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/airport-transfer?from=cmb" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Colombo Airport (CMB)
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem' }}>
                <Link href="/airport-transfer?from=mattala" style={{ color: '#666', textDecoration: 'none', fontSize: '1rem' }}>
                  • Mattala Airport
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem', marginLeft: '1rem', color: '#666' }}>
                • 24/7 Availability
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/fleet" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🚙 Our Fleet
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/hotels" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🏨 Hotel Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#053b3c', borderBottom: '2px solid #f8b500', paddingBottom: '0.5rem' }}>
              Popular Destinations
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/colombo" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Colombo
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/kandy" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Kandy
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/ella" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Ella
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/sigiriya" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Sigiriya
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/yala" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Yala National Park
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/galle" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Galle
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/nuwara-eliya" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Nuwara Eliya
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/mirissa" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Mirissa
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/bentota" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Bentota
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations/anuradhapura" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📍 Anuradhapura
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 'bold' }}>
                  → View All Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Additional Pages */}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#053b3c', borderBottom: '2px solid #f8b500', paddingBottom: '0.5rem' }}>
              Information
            </h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/hotels" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🏨 Hotels & Accommodations
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/destinations" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🗺️ All Destinations
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/blog" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📝 Travel Blog
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/terms" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  📄 Terms & Conditions
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/privacy" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🔒 Privacy Policy
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/faq" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  ❓ Frequently Asked Questions
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link href="/sitemap" style={{ color: '#053b3c', textDecoration: 'none', fontSize: '1.05rem' }}>
                  🗂️ Sitemap (This Page)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* XML Sitemap Link */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '0.5rem' }}>
            For search engines, view our XML sitemap:
          </p>
          <a 
            href="/api/sitemap.xml" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#053b3c', fontWeight: 'bold', textDecoration: 'underline' }}
          >
            https://zamzamlankatours.com/api/sitemap.xml
          </a>
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #053b3c 0%, #0a5f5f 100%)', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Ready to Explore Sri Lanka?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            Contact us to plan your perfect Sri Lankan adventure
          </p>
          <Link href="/contact" style={{ display: 'inline-block', padding: '12px 30px', background: '#f8b500', color: '#053b3c', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
