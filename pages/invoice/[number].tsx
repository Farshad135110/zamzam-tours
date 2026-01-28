import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function InvoicePage() {
  const router = useRouter();
  const { number } = router.query;
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (number) {
      fetchInvoice(number as string);
    }
  }, [number]);

  const fetchInvoice = async (invoiceNumber: string) => {
    try {
      const res = await fetch(`/api/invoices?invoiceNumber=${encodeURIComponent(invoiceNumber)}`);
      const data = await res.json();
      
      if (res.ok && data.invoices && data.invoices.length > 0) {
        setInvoice(data.invoices[0]);
      } else {
        setError('Invoice not found');
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${num.toFixed(2)}`;
  };

  const getPaymentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'cash': 'Cash Payment',
      'bank-transfer': 'Bank Transfer',
      'card': 'Credit/Debit Card',
      'online': 'Online Payment'
    };
    return types[type] || type;
  };

  const getServiceName = () => {
    if (!invoice || !invoice.service_details) return 'Service';
    
    const details = typeof invoice.service_details === 'string' 
      ? JSON.parse(invoice.service_details) 
      : invoice.service_details;

    if (invoice.service_type === 'tour') {
      return details.package_name || 'Tour Package';
    } else if (invoice.service_type === 'vehicle') {
      return details.vehicle_name || 'Vehicle Rental';
    } else if (invoice.service_type === 'hotel') {
      return details.hotel_name || 'Hotel Accommodation';
    }
    return 'Service';
  };

  const getServiceDetails = () => {
    if (!invoice || !invoice.service_details) return null;
    
    const details = typeof invoice.service_details === 'string' 
      ? JSON.parse(invoice.service_details) 
      : invoice.service_details;

    return details;
  };

  const getServiceTypeLabel = () => {
    if (!invoice) return 'Service';
    
    if (invoice.service_type === 'tour') {
      return 'Tour Package';
    } else if (invoice.service_type === 'vehicle') {
      return 'Vehicle Rental';
    } else if (invoice.service_type === 'hotel') {
      return 'Hotel Accommodation';
    }
    return invoice.service_type.charAt(0).toUpperCase() + invoice.service_type.slice(1);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Invoice... | ZamZam Lanka Tours</title>
        </Head>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoice...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !invoice) {
    return (
      <>
        <Head>
          <title>Invoice Not Found | ZamZam Lanka Tours</title>
        </Head>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The invoice you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Invoice {invoice.invoice_number} | ZamZam Lanka Tours</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-8 invoice-page">
        <div className="max-w-4xl mx-auto px-4">
          {/* Print Button - Hidden when printing */}
          <div className="mb-6 no-print flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
          </div>

          {/* Invoice Container */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden invoice-container">
            {/* Header with Logo and Gradient */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://res.cloudinary.com/dhqhxma30/image/upload/v1769571998/zamzamlankatourslogonewcropped_knodzl.png" 
                    alt="ZamZam Lanka Tours" 
                    className="h-16 w-auto bg-white rounded-lg p-2"
                  />
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
                    <p className="text-emerald-100 text-sm mt-1">ZamZam Lanka Tours</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{invoice.invoice_number}</div>
                  <div className="text-emerald-100 text-sm mt-1">
                    {formatDate(invoice.payment_date)}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info Bar */}
            <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  reservation@zamzamlankatours.com
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +94 70 188 8993
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  112/13 Morris Road, Milidduwa, Galle.
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Bill To & Invoice Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 invoice-section">
                {/* Bill To */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">Bill To</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="font-bold text-lg text-gray-900">{invoice.customer_name}</div>
                    <div className="text-sm text-gray-600">{invoice.customer_email}</div>
                    {invoice.customer_phone && <div className="text-sm text-gray-600">{invoice.customer_phone}</div>}
                    {invoice.customer_country && <div className="text-sm text-gray-600">{invoice.customer_country}</div>}
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">Invoice Details</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quotation Ref:</span>
                      <span className="font-semibold">{invoice.quotation_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        invoice.invoice_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {invoice.invoice_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            {/* Service Details */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-6 mb-8 invoice-section">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800">Service Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-fit">Service Type:</span>
                  <span className="text-gray-900">{getServiceTypeLabel()}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-fit">Service:</span>
                  <span className="text-gray-900 font-medium">{getServiceName()}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-fit">Start Date:</span>
                  <span className="text-gray-900">{formatDate(invoice.service_start_date)}</span>
                </div>
                {invoice.service_end_date && (
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-fit">End Date:</span>
                    <span className="text-gray-900">{formatDate(invoice.service_end_date)}</span>
                  </div>
                )}
                {(() => {
                  const details = getServiceDetails();
                  if (!details) return null;
                  
                  if (invoice.service_type === 'tour') {
                    return (
                      <>
                        {details.duration_days && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Duration:</span>
                            <span className="text-gray-900">{details.duration_days} Days / {details.duration_days - 1} Nights</span>
                          </div>
                        )}
                        {(details.num_adults || details.num_children) && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Passengers:</span>
                            <span className="text-gray-900">
                              {details.num_adults} Adult{details.num_adults > 1 ? 's' : ''}
                              {details.num_children > 0 && ` + ${details.num_children} Child${details.num_children > 1 ? 'ren' : ''}`}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  } else if (invoice.service_type === 'vehicle') {
                    return (
                      <>
                        {details.vehicle_type && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Vehicle Type:</span>
                            <span className="text-gray-900">{details.vehicle_type}</span>
                          </div>
                        )}
                        {details.capacity && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Capacity:</span>
                            <span className="text-gray-900">{details.capacity} Passengers</span>
                          </div>
                        )}
                        {details.km_per_day && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">KM Per Day:</span>
                            <span className="text-gray-900">{details.km_per_day} km</span>
                          </div>
                        )}
                        {details.available_for && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Available For:</span>
                            <span className="text-gray-900">{details.available_for}</span>
                          </div>
                        )}
                      </>
                    );
                  } else if (invoice.service_type === 'hotel') {
                    return (
                      <>
                        {details.location && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Location:</span>
                            <span className="text-gray-900">{details.location}</span>
                          </div>
                        )}
                        {details.price_range && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Price Range:</span>
                            <span className="text-gray-900">{details.price_range}</span>
                          </div>
                        )}
                        {(details.num_adults || details.num_children) && (
                          <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 min-w-fit">Guests:</span>
                            <span className="text-gray-900">
                              {details.num_adults} Adult{details.num_adults > 1 ? 's' : ''}
                              {details.num_children > 0 && ` + ${details.num_children} Child${details.num_children > 1 ? 'ren' : ''}`}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-6 mb-8 invoice-section">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-800">Payment Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-fit">Payment Method:</span>
                  <span className="text-gray-900">{getPaymentTypeLabel(invoice.payment_type)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-gray-700 min-w-fit">Payment Date:</span>
                  <span className="text-gray-900">{formatDate(invoice.payment_date)}</span>
                </div>
                {invoice.payment_reference && (
                  <div className="md:col-span-2 flex items-start gap-2">
                    <span className="font-semibold text-gray-700 min-w-fit">Reference:</span>
                    <span className="text-gray-900 font-mono">{invoice.payment_reference}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Table */}
            <div className="mb-8 invoice-section">
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                      <th className="text-left p-4 font-semibold text-sm uppercase tracking-wide">Description</th>
                      <th className="text-right p-4 font-semibold text-sm uppercase tracking-wide">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-gray-200">
                      <td className="p-4 text-gray-700">Total Service Cost</td>
                      <td className="text-right p-4 font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="p-4 text-gray-700">Deposit ({invoice.deposit_percentage}%)</td>
                      <td className="text-right p-4 font-semibold text-gray-900">{formatCurrency(invoice.deposit_amount)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-4 text-gray-700">Remaining Balance</td>
                      <td className="text-right p-4 font-semibold text-gray-900">{formatCurrency(invoice.remaining_amount)}</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b-2 border-emerald-600">
                      <td className="p-4 text-emerald-900 font-bold text-lg">PAID AMOUNT</td>
                      <td className="text-right p-4 text-emerald-700 font-bold text-xl">{formatCurrency(invoice.paid_amount)}</td>
                    </tr>
                    {parseFloat(invoice.paid_amount) < parseFloat(invoice.total_amount) && (
                      <tr className="bg-gradient-to-r from-orange-50 to-orange-100">
                        <td className="p-4 text-orange-900 font-bold text-lg">BALANCE DUE</td>
                        <td className="text-right p-4 font-bold text-orange-600 text-xl">
                          {formatCurrency(parseFloat(invoice.total_amount) - parseFloat(invoice.paid_amount))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 rounded-xl p-6 mb-8 invoice-section">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-800">Additional Notes</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{invoice.notes}</p>
              </div>
            )}

            {/* Thank You Message */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl p-8 text-center mb-8 relative overflow-hidden invoice-section">
              <div className="absolute top-0 right-0 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-3">Thank You for Your Business!</h2>
                <p className="text-emerald-100 text-lg">We look forward to serving you and making your journey memorable.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6 pb-2">
              <p className="mb-2 font-semibold text-gray-700">This is an official invoice from ZamZam Lanka Tours.</p>
              <p className="mb-3 text-gray-600">For any questions regarding this invoice, please contact us at <a href="mailto:reservation@zamzamlankatours.com" className="text-emerald-600 hover:underline">reservation@zamzamlankatours.com</a></p>
              <p className="text-xs text-gray-400">
                Invoice generated on {formatDate(new Date().toISOString())}
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>

      <style jsx global>{`
        @media print {
          /* Hide non-essential elements - completely remove from print flow */
          nav,
          footer,
          .navbar,
          header,
          .no-print,
          .footer {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            left: -9999px !important;
          }

          /* Prevent page breaks in footer area */
          body > *:last-child {
            page-break-before: avoid !important;
            break-before: avoid !important;
          }

          /* Reset page margins */
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Reset invoice page container */
          .invoice-page {
            min-height: auto !important;
            padding: 20px !important;
            margin: 0 !important;
            background: linear-gradient(to bottom right, #f9fafb, #f3f4f6) !important;
          }

          /* Keep the beautiful styling */
          .invoice-container {
            max-width: 100% !important;
            margin: 0 auto !important;
          }

          /* Preserve all colors and gradients */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Page break control - prevent breaks inside sections */
          .invoice-section,
          table,
          .bg-gradient-to-br,
          .bg-gradient-to-r,
          .rounded-xl,
          .rounded-2xl {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Keep table rows together */
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Page setup */
          @page {
            margin: 0.5cm;
            size: A4 portrait;
          }

          /* Avoid orphaned content */
          p,
          div {
            orphans: 3;
            widows: 3;
          }

          /* Keep max width reasonable for print */
          .max-w-4xl {
            max-width: 210mm !important;
          }
        }
      `}</style>
    </>
  );
}
