// Customer-facing quotation view page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Head from 'next/head';

interface Quotation {
  quotation_id: number;
  quotation_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_name: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  num_adults: number;
  num_children: number;
  num_infants: number;
  base_price: number;
  accommodation_type: string;
  accommodation_upgrade: number;
  discount_amount: number;
  discount_percentage: number;
  subtotal: number;
  total_amount: number;
  currency: string;
  deposit_percentage: number;
  deposit_amount: number;
  balance_amount: number;
  deposit_due_date: string;
  balance_due_date: string;
  status: string;
  valid_until: string;
  included_services: string[];
  excluded_services: string[];
  special_requests: string;
  created_at: string;
  service_type: string;
  service_id: string;
  service_details: any;
}

export default function QuotationView() {
  const router = useRouter();
  const { number } = router.query;
  
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // WhatsApp URL for customer support
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+94701888993';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I have a question about quotation ${quotation?.quotation_number || ''}`)}`;

  useEffect(() => {
    if (number) {
      fetchQuotation(number as string);
    }
  }, [number]);

  const fetchQuotation = async (quotationNumber: string) => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching quotation:', quotationNumber);
      const res = await fetch(`/api/quotations/${quotationNumber}?trackView=true`);
      console.log('Response status:', res.status);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.ok && data.quotation) {
        // Convert numeric string fields to numbers for proper display
        const q = data.quotation;
        const parsedQuotation = {
          ...q,
          base_price: parseFloat(q.base_price),
          accommodation_upgrade: parseFloat(q.accommodation_upgrade || 0),
          discount_amount: parseFloat(q.discount_amount || 0),
          discount_percentage: parseFloat(q.discount_percentage || 0),
          subtotal: parseFloat(q.subtotal),
          total_amount: parseFloat(q.total_amount),
          deposit_amount: parseFloat(q.deposit_amount),
          balance_amount: parseFloat(q.balance_amount),
          num_adults: parseInt(q.num_adults),
          num_children: parseInt(q.num_children || 0),
          num_infants: parseInt(q.num_infants || 0),
          duration_days: parseInt(q.duration_days),
          deposit_percentage: parseInt(q.deposit_percentage)
        };
        setQuotation(parsedQuotation);
        setError('');
      } else {
        setError(data.error || 'Quotation not found');
      }
    } catch (err: any) {
      console.error('Error fetching quotation:', err);
      setError('Failed to load quotation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuotation = async () => {
    if (!quotation) return;

    try {
      // Update quotation status to accepted
      const res = await fetch(`/api/quotations/${quotation.quotation_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
      });

      if (res.ok) {
        alert('Thank you! We have received your acceptance. We will contact you shortly with booking details.');
        setShowAcceptModal(false);
        fetchQuotation(number as string);
      }
    } catch (err) {
      console.error('Error accepting quotation:', err);
      alert('Failed to accept quotation. Please try again or contact us directly.');
    }
  };

  const handleDownloadPDF = () => {
    // Print-friendly PDF generation
    window.print();
  };

  const isExpired = quotation ? new Date(quotation.valid_until) < new Date() : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quotation Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The quotation you are looking for does not exist or has been removed.'}</p>
          <a href="/" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Quotation {quotation.quotation_number} - {quotation.tour_name} | ZamZam Lanka Tours</title>
        <meta name="description" content={`Tour quotation for ${quotation.tour_name}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <style jsx global>{`
        @media print {
          /* Hide elements not needed in print */
          nav, footer, .no-print, .print-hide {
            display: none !important;
          }
          
          /* Reset padding and background for print */
          body {
            background: white !important;
            padding: 0 !important;
          }
          
          /* Main container adjustments */
          .min-h-screen {
            padding-top: 20px !important;
            padding-bottom: 0 !important;
            background: white !important;
          }
          
          /* Ensure proper page breaks - keep sections together */
          .print-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Keep day itinerary items together */
          .border-l-4 {
            page-break-inside: avoid;
            break-inside: avoid;
            orphans: 3;
            widows: 3;
          }
          
          /* Keep image with its content */
          .rounded-lg.overflow-hidden {
            page-break-before: avoid;
            page-break-after: avoid;
            break-before: avoid;
            break-after: avoid;
          }
          
          /* Prevent orphaned headings */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            break-after: avoid;
            orphans: 3;
            widows: 3;
          }
          
          /* Keep background boxes together */
          .bg-white, .bg-emerald-50, .bg-blue-50, .bg-purple-50 {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          /* Print-friendly colors */
          .bg-gradient-to-r, .bg-gradient-to-br {
            background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .shadow, .shadow-lg {
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }
          
          /* Optimize images for print */
          img {
            max-width: 100%;
            page-break-inside: avoid;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Better margins for print */
          @page {
            margin: 1.5cm;
            size: A4;
          }
          
          /* Ensure text is readable */
          .text-gray-600, .text-gray-700 {
            color: #333 !important;
          }
          
          /* Keep colored elements visible */
          .bg-emerald-600, .bg-emerald-700 {
            background-color: #059669 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .bg-emerald-50 {
            background-color: #f0fdf4 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .text-emerald-600, .text-emerald-700 {
            color: #059669 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Ensure borders print */
          .border-emerald-600, .border-emerald-500, .border-l-4 {
            border-color: #059669 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Day badges and colored backgrounds */
          .bg-emerald-600.text-white, .rounded-full {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Adjust font sizes for print */
          h1 { font-size: 24pt !important; }
          h2 { font-size: 18pt !important; }
          h3 { font-size: 14pt !important; }
          
          /* Ensure white text on dark backgrounds prints */
          .text-white {
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Ensure gradient backgrounds print correctly */
          section[style*="linear-gradient"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Ensure review section text is visible in print */
          section[style*="linear-gradient"] * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Add print button that shows a message */
          .print-message {
            display: block !important;
            text-align: center;
            padding: 10px;
            background: #f0fdf4;
            border: 1px solid #059669;
            margin-bottom: 20px;
          }
        }
        
        @media screen {
          .print-message {
            display: none;
          }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1 }} className="print-hide">
        <Navbar />
      </div>

      <div className="min-h-screen bg-gray-50" style={{ paddingTop: '100px' }}>
        <div className="print-message">
          <strong>ZamZam Lanka Tours</strong> - Tour Quotation Document
        </div>
        
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 quotation-container" style={{ paddingBottom: '3rem' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg p-4 sm:p-6 md:p-8 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tour Quotation</h1>
                <p className="text-emerald-100 text-base sm:text-lg">ZamZam Lanka Tours</p>
              </div>
              <div className="sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">{quotation.quotation_number}</div>
                <div className="text-emerald-100 text-sm mt-1">
                  Issued: {new Date(quotation.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Validity Warning */}
          {isExpired ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⚠️</div>
                <div>
                  <p className="font-semibold text-red-800">This quotation has expired</p>
                  <p className="text-red-700 text-sm">Valid until: {new Date(quotation.valid_until).toLocaleDateString()}</p>
                  <p className="text-red-600 text-sm mt-1">Please contact us for an updated quotation.</p>
                </div>
              </div>
            </div>
          ) : quotation.status === 'accepted' ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <p className="font-semibold text-green-800">Quotation Accepted</p>
                  <p className="text-green-700 text-sm">Thank you! We will contact you shortly with booking details.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⏰</div>
                <div>
                  <p className="font-semibold text-yellow-800">Valid Until: {new Date(quotation.valid_until).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-yellow-700 text-sm">Accept this quotation before it expires to secure your booking.</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{quotation.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{quotation.customer_email}</p>
              </div>
              {quotation.customer_phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{quotation.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tour Package Details */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">
              {quotation.service_type === 'vehicle' ? 'Vehicle Rental Details' : 
               quotation.service_type === 'hotel' ? 'Hotel Booking Details' : 'Tour Package'}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">
                  {quotation.service_type === 'vehicle' ? 'Vehicle' : 
                   quotation.service_type === 'hotel' ? 'Hotel Name' : 'Package Name'}
                </p>
                <p className="font-semibold text-base sm:text-lg text-emerald-700">{quotation.tour_name}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quotation.service_type === 'tour' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{quotation.duration_days} Days / {quotation.duration_days - 1} Nights</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Accommodation</p>
                      <p className="font-semibold capitalize">{quotation.accommodation_type}</p>
                    </div>
                  </>
                )}
                {quotation.service_type === 'vehicle' && (
                  <div>
                    <p className="text-sm text-gray-600">Rental Duration</p>
                    <p className="font-semibold">{quotation.duration_days} Days</p>
                  </div>
                )}
                {quotation.service_type === 'hotel' && (
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{quotation.duration_days} Nights</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {quotation.service_type === 'vehicle' ? 'Rental Period' : 
                     quotation.service_type === 'airport-transfer' || quotation.service_type === 'all-island-transfer' ? 'Transfer Date' : 'Travel Dates'}
                  </p>
                  <p className="font-semibold">
                    {quotation.service_type === 'airport-transfer' || quotation.service_type === 'all-island-transfer' ? (
                      new Date(quotation.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    ) : (
                      <>
                        {new Date(quotation.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' to '}
                        {new Date(quotation.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </>
                    )}
                  </p>
                </div>
                {quotation.service_type === 'tour' && (
                  <div>
                    <p className="text-sm text-gray-600">Passengers</p>
                    <p className="font-semibold">
                      {quotation.num_adults} Adult{quotation.num_adults > 1 ? 's' : ''}
                      {quotation.num_children > 0 && ` + ${quotation.num_children} Child${quotation.num_children > 1 ? 'ren' : ''}`}
                      {quotation.num_infants > 0 && ` + ${quotation.num_infants} Infant${quotation.num_infants > 1 ? 's' : ''}`}
                    </p>
                  </div>
                )}
              </div>
              {quotation.special_requests && (
                <div>
                  <p className="text-sm text-gray-600">Special Requests</p>
                  <p className="font-semibold text-gray-700">{quotation.special_requests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tour Itinerary - Day by Day (For Tours) */}
          {quotation.service_type === 'tour' && quotation.service_details?.itinerary && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">
                📅 Day-by-Day Itinerary
              </h2>
              <div className="space-y-6">
                {quotation.service_details.itinerary.map((day: any, index: number) => (
                  <div key={index} className="border-l-4 border-emerald-500 pl-4 sm:pl-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                        {day.day || index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900">{day.title}</h3>
                        {day.location && (
                          <p className="text-sm text-gray-600">📍 {day.location}</p>
                        )}
                      </div>
                    </div>
                    {day.image && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={day.image} 
                          alt={day.title}
                          className="w-full h-48 sm:h-64 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {day.description}
                    </p>
                    {day.activities && (
                      <div className="mt-3 bg-emerald-50 p-3 rounded-lg">
                        <p className="font-semibold text-sm text-emerald-900 mb-2">✨ Activities:</p>
                        <ul className="space-y-1">
                          {day.activities.split('\n').filter((a: string) => a.trim()).map((activity: string, idx: number) => (
                            <li key={idx} className="flex items-start text-sm text-gray-700">
                              <span className="text-emerald-600 mr-2 font-bold">✓</span>
                              <span>{activity.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {day.meals && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Meals:</span> {day.meals}
                      </p>
                    )}
                    {day.accommodation && (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-semibold">Accommodation:</span> {day.accommodation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Details (For Car Rentals) */}
          {quotation.service_type === 'vehicle' && quotation.service_details && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">
                🚗 Vehicle Details
              </h2>
              {quotation.service_details.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={quotation.service_details.image} 
                    alt={quotation.service_details.vehicle_name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle Name</p>
                  <p className="font-semibold text-lg">{quotation.service_details.vehicle_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vehicle Type</p>
                  <p className="font-semibold">{quotation.service_details.vehicle_type}</p>
                </div>
                {quotation.service_details.capacity && (
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold">{quotation.service_details.capacity} Passengers</p>
                  </div>
                )}
                {quotation.service_details.km_per_day && (
                  <div>
                    <p className="text-sm text-gray-600">Km Per Day</p>
                    <p className="font-semibold">{quotation.service_details.km_per_day} km</p>
                  </div>
                )}
                {quotation.service_details.extra_charge_per_km && (
                  <div>
                    <p className="text-sm text-gray-600">Extra Charge Per Km</p>
                    <p className="font-semibold">Rs {quotation.service_details.extra_charge_per_km}</p>
                  </div>
                )}
              </div>
              {quotation.service_details.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-700">{quotation.service_details.description}</p>
                </div>
              )}
              {quotation.service_details.available_for && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Available For</p>
                  <p className="text-gray-700">{quotation.service_details.available_for}</p>
                </div>
              )}
            </div>
          )}

          {/* Hotel Details (For Hotel Bookings) */}
          {quotation.service_type === 'hotel' && quotation.service_details && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">
                🏨 Hotel Details
              </h2>
              {quotation.service_details.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={quotation.service_details.image} 
                    alt={quotation.service_details.hotel_name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Hotel Name</p>
                  <p className="font-semibold text-lg">{quotation.service_details.hotel_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{quotation.service_details.location}</p>
                </div>
                {quotation.service_details.price_range && (
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">{quotation.service_details.price_range}</p>
                  </div>
                )}
                {quotation.service_details.facilities && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {quotation.service_details.facilities.split(',').map((facility: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                        >
                          {facility.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Included */}
          {quotation.included_services && quotation.included_services.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">Services Included</h2>
              <ul className="space-y-2">
                {quotation.included_services.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-emerald-600 font-bold mr-3 mt-1">✓</span>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">Pricing Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start py-2 border-b border-gray-200 gap-3">
                <span className="text-xs sm:text-sm lg:text-base text-gray-700 flex-1 min-w-0">
                  Tour Package ({quotation.num_adults} Adult{quotation.num_adults > 1 ? 's' : ''}
                  {quotation.num_children > 0 && ` + ${quotation.num_children} Child${quotation.num_children > 1 ? 'ren' : ''}`})
                </span>
                <span className="font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0">{quotation.currency} {quotation.base_price.toFixed(2)}</span>
              </div>

              {quotation.accommodation_upgrade > 0 && (
                <div className="flex justify-between items-start py-2 border-b border-gray-200 gap-3">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-700 flex-1 min-w-0 break-words">Accommodation Upgrade ({quotation.accommodation_type})</span>
                  <span className="font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0">{quotation.currency} {quotation.accommodation_upgrade.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b-2 border-gray-300 font-semibold gap-3">
                <span className="text-gray-900 text-sm sm:text-base">Subtotal</span>
                <span className="text-sm sm:text-base whitespace-nowrap">{quotation.currency} {quotation.subtotal.toFixed(2)}</span>
              </div>

              {quotation.discount_amount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 text-green-600 gap-3">
                  <span className="font-semibold text-sm sm:text-base">Discount ({quotation.discount_percentage}%)</span>
                  <span className="font-semibold text-sm sm:text-base whitespace-nowrap">- {quotation.currency} {quotation.discount_amount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-4 bg-emerald-50 px-3 sm:px-4 rounded-lg gap-2">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">TOTAL TOUR COST</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600 whitespace-nowrap">{quotation.currency} {quotation.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">Payment Terms</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Deposit ({quotation.deposit_percentage}%)</span>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-blue-600 whitespace-nowrap">{quotation.currency} {quotation.deposit_amount.toFixed(2)}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">Due upon booking confirmation</p>
              </div>

              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Balance ({100 - quotation.deposit_percentage}%)</span>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-purple-600 whitespace-nowrap">{quotation.currency} {quotation.balance_amount.toFixed(2)}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Due {quotation.balance_due_date ? new Date(quotation.balance_due_date).toLocaleDateString() : '14 days before tour commencement'}
                </p>
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Accepted Payment Methods:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 sm:ml-4 text-xs sm:text-sm">
                  <li>Bank Transfer</li>
                  <li>Credit/Debit Card (Visa, Mastercard)</li>
                  <li>PayPal</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-emerald-600 pb-2">Cancellation Policy</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span><strong>30+ days before tour:</strong> Full refund minus 10% admin fee</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span><strong>15-29 days before:</strong> 50% refund</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span><strong>Less than 15 days:</strong> No refund</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <span><strong>Note:</strong> Deposit is non-refundable</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {!isExpired && quotation.status !== 'accepted' && (
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="bg-emerald-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg hover:bg-emerald-700 font-bold text-sm sm:text-base lg:text-lg transition-colors w-full min-h-[44px]"
                >
                  ✓ Accept This Quotation
                </button>
              )}
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-600 font-bold text-sm sm:text-base lg:text-lg text-center transition-colors flex items-center justify-center min-h-[44px]"
              >
                💬 Chat on WhatsApp
              </a>

              <button
                onClick={handleDownloadPDF}
                className="border-2 border-gray-300 text-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-50 font-semibold text-sm sm:text-base transition-colors w-full min-h-[44px]"
              >
                📄 Download PDF
              </button>

              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}?subject=Question about Quotation ${quotation.quotation_number}`}
                className="border-2 border-gray-300 text-gray-700 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-50 font-semibold text-sm sm:text-base text-center transition-colors flex items-center justify-center min-h-[44px]"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 print-section">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Need Help?</h3>
              <p className="text-emerald-100 mb-4 sm:mb-6 text-sm sm:text-base">Our team is here to assist you!</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 lg:gap-8 text-xs sm:text-sm lg:text-base">
                <a href="mailto:reservation@zamzamlankatours.com" className="flex items-center gap-2 hover:text-emerald-200 transition-colors break-all">
                  <span className="text-lg sm:text-xl flex-shrink-0">📧</span>
                  <span className="font-semibold">reservation@zamzamlankatours.com</span>
                </a>
                <a 
                  href="https://wa.me/94701888993?text=Hi, I have a question about my quotation" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-200 transition-colors"
                >
                  <span className="text-lg sm:text-xl flex-shrink-0">💬</span>
                  <span className="font-semibold whitespace-nowrap">WhatsApp: +94 70 188 8993</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Quotation Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Accept Quotation</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Are you sure you want to accept this quotation? We will contact you shortly with booking details and payment instructions.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>Note:</strong> By accepting, you agree to the terms and conditions outlined in this quotation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptQuotation}
                className="flex-1 px-4 sm:px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm sm:text-base order-1 sm:order-2"
              >
                Yes, Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @media print {
          nav, footer, button, .no-print {
            display: none !important;
          }
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 640px) {
          :global(.quotation-container) {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          
          /* Ensure text doesn't overflow on small screens */
          :global(.quotation-text) {
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
          }
          
          /* Make sure images are responsive */
          :global(img) {
            max-width: 100%;
            height: auto;
          }
          
          /* Ensure pricing amounts don't wrap awkwardly */
          :global(.price-row) {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          /* Touch-friendly button sizing */
          :global(button), :global(a.button) {
            min-height: 44px;
            touch-action: manipulation;
          }
        }
        
        /* Very small screens (320px - 375px) */
        @media (max-width: 375px) {
          :global(.quotation-container) {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          /* Reduce font sizes slightly on very small screens */
          :global(.quotation-header) {
            font-size: 1.25rem;
          }
          
          :global(.quotation-subheader) {
            font-size: 1rem;
          }
          
          /* Compact pricing on tiny screens */
          :global(.total-price) {
            font-size: 1.25rem;
          }
        }
        
        /* Horizontal overflow protection */
        @media (max-width: 768px) {
          :global(body) {
            overflow-x: hidden;
          }
          
          :global(.quotation-content) {
            max-width: 100%;
            overflow-x: hidden;
          }
          
          /* Stack modal buttons on very small screens */
          @media (max-width: 400px) {
            :global(.modal-buttons) {
              flex-direction: column;
            }
            
            :global(.modal-buttons button) {
              width: 100%;
            }
          }
        }
      `}</style>
    </>
  );
}
