// Admin panel page for managing tour quotations
import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';

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
  total_amount: number;
  currency: string;
  status: string;
  valid_until: string;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  created_at: string;
}

export default function QuotationsAdmin() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState<string | null>(null);

  // Available services and data
  const [serviceType, setServiceType] = useState<'tour' | 'vehicle' | 'hotel' | 'airport-transfer' | 'all-island-transfer'>('tour');
  const [tours, setTours] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Location lists for transfer services
  const airports = ['Colombo (CMB) - Bandaranaike International Airport', 'Mattala (HRI) - Rajapaksa International Airport'];
  const districts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'];
  const popularDestinations = ['Sigiriya', 'Ella', 'Mirissa', 'Bentota', 'Unawatuna', 'Arugam Bay', 'Yala National Park', 'Udawalawe', 'Pinnawala', 'Dambulla', 'Anuradhapura (Ancient City)', 'Polonnaruwa (Ancient City)', 'Tangalle', 'Negombo', 'Trincomalee Beach', 'Jaffna Peninsula'];

  // Form state for creating new quotation
  const [formData, setFormData] = useState({
    serviceType: 'tour',
    serviceId: '',
    withDriver: true,
    numRooms: 1,
    pickupLocation: '',
    dropoffLocation: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCountry: '',
    tourName: '',
    startDate: '',
    endDate: '',
    durationDays: 5,
    numAdults: 2,
    numChildren: 0,
    numInfants: 0,
    basePrice: 500,
    accommodationType: 'standard',
    currency: 'USD',
    depositPercentage: 30,
    includedServices: [] as string[],
    specialRequests: '',
    source: 'website',
    createdBy: 'admin'
  });

  useEffect(() => {
    fetchQuotations();
    loadServiceData();
  }, [filter, searchTerm]);

  // Load tours, vehicles, hotels from database
  const loadServiceData = async () => {
    try {
      // Fetch tours (packages)
      const toursRes = await fetch('/api/packages');
      if (toursRes.ok) {
        const toursData = await toursRes.json();
        setTours(Array.isArray(toursData) ? toursData : []);
      }

      // Fetch vehicles
      const vehiclesRes = await fetch('/api/vehicles');
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      }

      // Fetch hotels
      const hotelsRes = await fetch('/api/hotels');
      if (hotelsRes.ok) {
        const hotelsData = await hotelsRes.json();
        setHotels(Array.isArray(hotelsData) ? hotelsData : []);
      }
    } catch (error) {
      console.error('Error loading service data:', error);
    }
  };

  // Handle service selection
  const handleServiceSelect = async (serviceId: string) => {
    let service = null;
    let serviceDetails = null;
    
    if (formData.serviceType === 'tour') {
      service = tours.find(t => t.package_id === serviceId);
      if (service) {
        const days = service.days || 5;
        let endDate = formData.endDate;
        
        // Auto-calculate end date if start date is set
        if (formData.startDate) {
          const start = new Date(formData.startDate);
          const end = new Date(start);
          end.setDate(end.getDate() + (days - 1));
          endDate = end.toISOString().split('T')[0];
        }
        
        // Store full service details
        serviceDetails = {
          package_id: service.package_id,
          package_name: service.package_name,
          description: service.description,
          highlights: service.highlights,
          includings: service.includings,
          itinerary: service.itinerary ? JSON.parse(service.itinerary) : null,
          days: service.days,
          nights: service.nights,
          image: service.image,
          price_per_person: service.price_per_person
        };
        
        setFormData({
          ...formData,
          serviceId,
          tourName: service.package_name,
          durationDays: days,
          endDate: endDate,
          basePrice: parseFloat(service.price_per_person || 500),
          includedServices: service.highlights ? service.highlights.split('\n').filter((s: string) => s.trim()) : []
        });
      }
    } else if (formData.serviceType === 'vehicle') {
      service = vehicles.find(v => v.vehicle_id === serviceId);
      if (service) {
        // Store full vehicle details
        serviceDetails = {
          vehicle_id: service.vehicle_id,
          vehicle_name: service.vehicle_name,
          vehicle_type: service.vehicle_type,
          description: service.description,
          capacity: service.capacity,
          km_per_day: service.km_per_day,
          price_per_day: service.price_per_day,
          extra_charge_per_km: service.extra_charge_per_km,
          image: service.image,
          available_for: service.available_for
        };
        
        setFormData({
          ...formData,
          serviceId,
          tourName: `Car Rental - ${service.vehicle_name}`,
          basePrice: parseFloat(service.price_per_day || 100)
        });
      }
    } else if (formData.serviceType === 'hotel') {
      service = hotels.find(h => h.hotel_id === serviceId);
      if (service) {
        // Store full hotel details
        serviceDetails = {
          hotel_id: service.hotel_id,
          hotel_name: service.hotel_name,
          location: service.location,
          price_range: service.price_range,
          facilities: service.facilities,
          image: service.image
        };
        
        setFormData({
          ...formData,
          serviceId,
          tourName: `Hotel Booking - ${service.hotel_name}`,
          basePrice: 0
        });
      }
    }
    
    setSelectedService(service);
    
    // Store service details in form data
    if (serviceDetails) {
      (window as any).currentServiceDetails = serviceDetails;
    }
  };

  // Auto-calculate end date when start date or duration changes
  const handleStartDateChange = (startDate: string) => {
    const days = formData.durationDays;
    let endDate = '';
    
    if (startDate && days > 0) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + (days - 1)); // days - 1 because start date is day 1
      endDate = end.toISOString().split('T')[0];
    }
    
    setFormData({ ...formData, startDate, endDate });
  };

  const handleDurationChange = (days: number) => {
    let endDate = formData.endDate;
    
    if (formData.startDate && days > 0) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + (days - 1)); // days - 1 because start date is day 1
      endDate = end.toISOString().split('T')[0];
    }
    
    setFormData({ ...formData, durationDays: days, endDate });
  };

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      let url = `/api/quotations?limit=100`;
      if (filter !== 'all') url += `&status=${filter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url);
      const data = await res.json();
      
      // Parse numeric fields from database strings to numbers
      const parsedQuotations = (data.quotations || []).map((q: any) => ({
        ...q,
        total_amount: parseFloat(q.total_amount),
        base_price: parseFloat(q.base_price || 0),
        num_adults: parseInt(q.num_adults),
        num_children: parseInt(q.num_children || 0),
        duration_days: parseInt(q.duration_days)
      }));
      
      setQuotations(parsedQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Auto-generate tourName for transfers if not set
      let finalFormData = { ...formData };
      if ((formData.serviceType === 'airport-transfer' || formData.serviceType === 'all-island-transfer') && !formData.tourName && formData.pickupLocation && formData.dropoffLocation) {
        finalFormData.tourName = `${formData.serviceType === 'airport-transfer' ? 'Airport Transfer' : 'All Island Transfer'}: ${formData.pickupLocation} → ${formData.dropoffLocation}`;
      }
      
      // Prepare quotation data with service details
      const quotationData = {
        ...finalFormData,
        serviceDetails: (window as any).currentServiceDetails || null
      };
      
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotationData)
      });

      const data = await res.json();
      
      if (data.success) {
        const quotationNumber = data.quotation.quotationNumber;
        setShowCreateModal(false);
        fetchQuotations();
        
        // Show success message with action options
        if (confirm(`✅ Quotation ${quotationNumber} created successfully!\n\n👁️ Click OK to preview it now, or Cancel to stay on this page.`)) {
          // Open quotation in new tab for preview
          window.open(`/quotation/${quotationNumber}`, '_blank');
        }
        
        // Reset form
        setFormData({
          serviceType: 'tour',
          serviceId: '',
          withDriver: true,
          numRooms: 1,
          pickupLocation: '',
          dropoffLocation: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerCountry: '',
          tourName: '',
          startDate: '',
          endDate: '',
          durationDays: 5,
          numAdults: 2,
          numChildren: 0,
          numInfants: 0,
          basePrice: 500,
          accommodationType: 'standard',
          currency: 'USD',
          depositPercentage: 30,
          includedServices: [] as string[],
          specialRequests: '',
          source: 'website',
          createdBy: 'admin'
        });
      } else {
        alert('Error creating quotation: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation');
    }
  };

  const handleSendQuotation = async (quotationId: number) => {
    if (!confirm('Are you sure you want to send this quotation to the customer?')) return;

    try {
      const res = await fetch('/api/quotations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotationId })
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Quotation sent successfully!');
        // Show email preview in modal
        setShowEmailPreview(data.emailPreview);
        fetchQuotations();
      } else {
        alert('Error sending quotation: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending quotation:', error);
      alert('Failed to send quotation');
    }
  };

  const handleDeleteQuotation = async (quotationId: number) => {
    if (!confirm('Are you sure you want to delete this quotation? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/quotations/${quotationId}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      
      if (data.success) {
        alert('Quotation deleted successfully!');
        fetchQuotations();
      } else {
        alert('Error deleting quotation: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Failed to delete quotation');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      viewed: 'bg-purple-500',
      accepted: 'bg-green-500',
      declined: 'bg-red-500',
      expired: 'bg-orange-500',
      converted: 'bg-emerald-600'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${colors[status] || 'bg-gray-500'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  return (
    <>
      <Head>
        <title>Quotation | ZamZam Lanka Tours Admin</title>
      </Head>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />

        <div className="flex-1 admin-content-wrapper" style={{ overflowX: 'auto' }}>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-full">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tour Quotations</h1>
                <p className="text-gray-600 mt-2">Manage tour booking quotations and estimates</p>
              </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Total Quotations</div>
              <div className="text-2xl font-bold text-gray-900">{quotations.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Sent</div>
              <div className="text-2xl font-bold text-blue-600">
                {quotations.filter(q => q.status === 'sent' || q.status === 'viewed').length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Accepted</div>
              <div className="text-2xl font-bold text-green-600">
                {quotations.filter(q => q.status === 'accepted').length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-2xl font-bold text-purple-600">
                {quotations.length > 0 
                  ? Math.round((quotations.filter(q => q.status === 'accepted').length / quotations.length) * 100) 
                  : 0}%
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-semibold"
              >
                ➕ Create New Quotation
              </button>
            </div>

            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="viewed">Viewed</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="expired">Expired</option>
              </select>

              <input
                type="text"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-64"
              />
            </div>
          </div>

          {/* Quotations Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading quotations...</div>
            ) : quotations.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No quotations found. Create your first quotation to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quotation #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Travel Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passengers</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quotations.map((quotation) => (
                      <tr key={quotation.quotation_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-emerald-600">{quotation.quotation_number}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(quotation.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{quotation.customer_name}</div>
                          <div className="text-sm text-gray-500">{quotation.customer_email}</div>
                          <div className="text-xs text-gray-400">{quotation.customer_phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">{quotation.tour_name}</div>
                          <div className="text-xs text-gray-500">{quotation.duration_days} Days</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(quotation.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <br />
                          <span className="text-gray-500">to</span>
                          <br />
                          {new Date(quotation.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {quotation.num_adults} Adult{quotation.num_adults > 1 ? 's' : ''}
                          {quotation.num_children > 0 && (
                            <div className="text-gray-500">{quotation.num_children} Child{quotation.num_children > 1 ? 'ren' : ''}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-lg">{quotation.currency} {quotation.total_amount.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(quotation.status)}
                          {quotation.viewed_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Viewed: {new Date(quotation.viewed_at).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={isExpired(quotation.valid_until) ? 'text-red-500 font-semibold' : 'text-gray-700'}>
                            {new Date(quotation.valid_until).toLocaleDateString()}
                          </div>
                          {isExpired(quotation.valid_until) && (
                            <div className="text-xs text-red-500">Expired</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`/quotation/${quotation.quotation_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 text-xs font-medium"
                              title="Preview quotation"
                            >
                              👁️ Preview
                            </a>
                            {quotation.status === 'draft' && (
                              <button
                                onClick={() => handleSendQuotation(quotation.quotation_id)}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 text-xs font-medium"
                                title="Send to customer via email"
                              >
                                📧 Send
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteQuotation(quotation.quotation_id)}
                              className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 text-xs font-medium"
                              title="Delete quotation"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Quotation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full my-4 shadow-xl" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
              {/* Modal Header - Fixed */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg z-10">
                <h2 className="text-xl sm:text-2xl font-bold">Create New Quotation</h2>
              </div>
              
              {/* Modal Body - Scrollable */}
              <form onSubmit={handleCreateQuotation} className="flex flex-col" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
                <div className="overflow-y-auto px-6 py-4 flex-1">
                  <div className="space-y-4">
                  
                  {/* Service Type Selection */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="font-semibold text-blue-900 mb-3">Step 1: Select Service Type</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { value: 'tour', label: '🎯 Tour Package', icon: '🗺️' },
                        { value: 'vehicle', label: '🚗 Car Rental', icon: '🚙' },
                        { value: 'hotel', label: '🏨 Hotel', icon: '🛏️' },
                        { value: 'airport-transfer', label: '✈️ Airport Transfer', icon: '🚕' },
                        { value: 'all-island-transfer', label: '🚐 All-Island Transfer', icon: '🚌' }
                      ].map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, serviceType: type.value as any, serviceId: '', tourName: '' })}
                          className={`p-3 text-center rounded-lg border-2 transition-all ${
                            formData.serviceType === type.value
                              ? 'border-blue-600 bg-blue-100 text-blue-900 font-bold'
                              : 'border-gray-300 bg-white hover:border-blue-400'
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-xs">{type.label.replace(/^[^\s]+ /, '')}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Selection */}
                  {formData.serviceType && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
                      <h3 className="font-semibold text-emerald-900 mb-3">
                        Step 2: Select {formData.serviceType === 'tour' ? 'Tour Package' : 
                          formData.serviceType === 'vehicle' ? 'Vehicle' : 
                          formData.serviceType === 'hotel' ? 'Hotel' : 'Transfer Type'}
                      </h3>
                      
                      {formData.serviceType === 'tour' && (
                        <select
                          value={formData.serviceId}
                          onChange={(e) => handleServiceSelect(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">-- Select a Tour Package --</option>
                          {tours.map(tour => (
                            <option key={tour.package_id} value={tour.package_id}>
                              {tour.package_name} - {tour.days} Days ({tour.nights} Nights)
                            </option>
                          ))}
                        </select>
                      )}

                      {formData.serviceType === 'vehicle' && (
                        <select
                          value={formData.serviceId}
                          onChange={(e) => handleServiceSelect(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">-- Select a Vehicle --</option>
                          {vehicles.map(vehicle => (
                            <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                              {vehicle.vehicle_name} - {vehicle.vehicle_type} (Rs {vehicle.price_per_day}/day)
                            </option>
                          ))}
                        </select>
                      )}

                      {formData.serviceType === 'hotel' && (
                        <select
                          value={formData.serviceId}
                          onChange={(e) => handleServiceSelect(e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="">-- Select a Hotel --</option>
                          {hotels.map(hotel => (
                            <option key={hotel.hotel_id} value={hotel.hotel_id}>
                              {hotel.hotel_name} - {hotel.location} ({hotel.price_range})
                            </option>
                          ))}
                        </select>
                      )}

                      {(formData.serviceType === 'airport-transfer' || formData.serviceType === 'all-island-transfer') && (
                        <input
                          type="text"
                          placeholder={`e.g., ${formData.serviceType === 'airport-transfer' ? 'Airport Transfer' : 'All Island Transfer'} - Colombo to Kandy`}
                          value={formData.tourName || (formData.pickupLocation && formData.dropoffLocation ? `${formData.serviceType === 'airport-transfer' ? 'Airport Transfer' : 'All Island Transfer'}: ${formData.pickupLocation} → ${formData.dropoffLocation}` : '')}
                          onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      )}
                    </div>
                  )}

                  {/* Customer Details */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Step 3: Customer Details</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.customerCountry}
                    onChange={(e) => setFormData({...formData, customerCountry: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Service/Tour Details */}
              {formData.tourName && (
                <div className="bg-gray-50 p-4 rounded border">
                  <label className="block text-sm font-medium mb-2">Service Name</label>
                  <div className="font-semibold text-lg text-emerald-700">{formData.tourName}</div>
                </div>
              )}

              {/* Booking Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Step 4: Booking Details</h3>
              </div>

              {formData.serviceType === 'airport-transfer' || formData.serviceType === 'all-island-transfer' ? (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transfer Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => {
                        setFormData({...formData, startDate: e.target.value, endDate: e.target.value, durationDays: 1});
                      }}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date (Departure) *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date (Return) *</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full border rounded px-3 py-2 bg-gray-50"
                      readOnly
                      title="Auto-calculated based on start date and duration"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.durationDays}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {formData.serviceType === 'tour' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numAdults}
                      onChange={(e) => setFormData({...formData, numAdults: parseInt(e.target.value)})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Children</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.numChildren}
                      onChange={(e) => setFormData({...formData, numChildren: parseInt(e.target.value)})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Infants</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.numInfants}
                      onChange={(e) => setFormData({...formData, numInfants: parseInt(e.target.value)})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {formData.serviceType === 'tour' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Accommodation Type</label>
                  <select
                    value={formData.accommodationType}
                    onChange={(e) => setFormData({...formData, accommodationType: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="standard">Standard</option>
                    <option value="deluxe">Deluxe (+$50/night)</option>
                    <option value="luxury">Luxury (+$100/night)</option>
                    <option value="premium">Premium (+$150/night)</option>
                  </select>
                </div>
              )}

              {formData.serviceType === 'vehicle' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Driver Option</label>
                  <select
                    value={formData.withDriver ? 'with-driver' : 'self-drive'}
                    onChange={(e) => setFormData({...formData, withDriver: e.target.value === 'with-driver'})}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="with-driver">With Driver</option>
                    <option value="self-drive">Self Drive (Without Driver)</option>
                  </select>
                </div>
              )}

              {formData.serviceType === 'hotel' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Rooms</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numRooms}
                    onChange={(e) => setFormData({...formData, numRooms: parseInt(e.target.value)})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )}

              {(formData.serviceType === 'airport-transfer' || formData.serviceType === 'all-island-transfer') && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">📍 Pickup Location *</label>
                    <select
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">-- Select Pickup Location --</option>
                      <optgroup label="✈️ Airports">
                        {airports.map((location, index) => (
                          <option key={`airport-${index}`} value={location}>{location}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📍 Districts">
                        {districts.map((location, index) => (
                          <option key={`district-${index}`} value={location}>{location}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🏖️ Popular Destinations">
                        {popularDestinations.map((location, index) => (
                          <option key={`dest-${index}`} value={location}>{location}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">📍 Drop-off Location *</label>
                    <select
                      value={formData.dropoffLocation}
                      onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">-- Select Drop-off Location --</option>
                      <optgroup label="✈️ Airports">
                        {airports.map((location, index) => (
                          <option key={`airport-drop-${index}`} value={location}>{location}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📍 Districts">
                        {districts.map((location, index) => (
                          <option key={`district-drop-${index}`} value={location}>{location}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🏖️ Popular Destinations">
                        {popularDestinations.map((location, index) => (
                          <option key={`dest-drop-${index}`} value={location}>{location}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3 text-base">Step 5: Pricing Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {formData.serviceType === 'vehicle' ? 'Total Price *' : 
                       formData.serviceType === 'hotel' ? 'Price per Night *' : 
                       'Base Price (per person) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                      className="w-full border rounded px-3 py-2"
                      placeholder={formData.serviceType === 'vehicle' ? '5000.00' : '500.00'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="LKR">LKR (Rs)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deposit %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.depositPercentage}
                      onChange={(e) => setFormData({...formData, depositPercentage: parseInt(e.target.value)})}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <div className="text-sm font-medium text-blue-900">Estimated Total</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formData.currency} {formData.serviceType === 'tour' 
                      ? (formData.basePrice * formData.numAdults).toFixed(2)
                      : (formData.basePrice * formData.durationDays).toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    {formData.serviceType !== 'tour' && (
                      <div className="mb-1">
                        {formData.basePrice.toFixed(2)} × {formData.durationDays} day{formData.durationDays > 1 ? 's' : ''}
                      </div>
                    )}
                    Deposit: {formData.currency} {formData.serviceType === 'tour'
                      ? ((formData.basePrice * formData.numAdults) * formData.depositPercentage / 100).toFixed(2)
                      : ((formData.basePrice * formData.durationDays) * formData.depositPercentage / 100).toFixed(2)}
                    {' '}({formData.depositPercentage}%)
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Included Services (one per line)</label>
                <textarea
                  value={formData.includedServices.join('\n')}
                  onChange={(e) => setFormData({...formData, includedServices: e.target.value.split('\n').filter(s => s.trim())})}
                  rows={6}
                  className="w-full border rounded px-3 py-2"
                  placeholder={formData.serviceType === 'vehicle' && formData.withDriver 
                    ? "Private A/C Vehicle with English-speaking Driver\nAll Fuel, Parking & Highway Charges\nDriver Accommodation & Meals\nGovernment Taxes"
                    : formData.serviceType === 'vehicle' && !formData.withDriver
                    ? "Vehicle Rental (Self Drive)\nBasic Insurance Coverage\nUnlimited Mileage\nGovernment Taxes"
                    : "Accommodation\nAll meals\nPrivate transportation\nEnglish-speaking guide"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Any special requirements or requests..."
                />
              </div>
                  </div>
                </div>

                {/* Modal Footer - Fixed */}
                <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      Create Quotation
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Email Preview</h2>
              <button
                onClick={() => setShowEmailPreview(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="border rounded-lg p-4 overflow-auto max-h-96">
              <div dangerouslySetInnerHTML={{ __html: showEmailPreview }} />
            </div>
            <button
              onClick={() => setShowEmailPreview(null)}
              className="mt-4 w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
      </div>
      </div>

      <style jsx>{`
        .admin-content-wrapper {
          margin-left: 0;
          min-width: 0;
        }

        @media (min-width: 901px) {
          .admin-content-wrapper {
            margin-left: 280px;
          }
        }
      `}</style>
    </>
  );
}
