// Admin panel page for managing tour quotations
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import CloudinaryUpload from '../../components/CloudinaryUpload';

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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedQuotationForInvoice, setSelectedQuotationForInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [vehicleImageUrls, setVehicleImageUrls] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const vehicleImageInputRef = useRef<HTMLInputElement>(null);
  
  // New tour creation modal
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const [tourSaveType, setTourSaveType] = useState<'package' | 'one-time'>('package');
  const [newTourData, setNewTourData] = useState({
    tourName: '',
    description: '',
    price: '',
    days: 1,
    image: '',
    highlights: '',
    includings: ''
  });
  const [dayItineraries, setDayItineraries] = useState<{
    day: number;
    title: string;
    description: string;
    activities: string;
    image?: string;
  }[]>([{
    day: 1,
    title: '',
    description: '',
    activities: '',
    image: ''
  }]);
  const [isCreatingTour, setIsCreatingTour] = useState(false);

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
    fetchInvoices();
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
          includedServices: service.includings ? service.includings.split(/[,\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0) : []
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
          available_for: service.available_for,
          rental_type: formData.withDriver ? 'with-driver' : 'self-drive'
        };
        
        // Create vehicle rental services
        const vehicleServices = [
          `${service.vehicle_name} - ${service.vehicle_type}`,
          'Comprehensive Insurance Coverage',
          'Unlimited Mileage (within daily limit)',
          '24/7 Roadside Assistance',
          'Free Additional Driver',
          'GPS Navigation System',
          'Child Seat Available (on request)',
          'Airport Pickup & Drop-off'
        ];
        
        if (service.available_for) {
          vehicleServices.push(`Available for: ${service.available_for}`);
        }
        
        setFormData({
          ...formData,
          serviceId,
          tourName: `Car Rental - ${service.vehicle_name}`,
          basePrice: parseFloat(service.price_per_day || 100),
          includedServices: vehicleServices
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
        
        // Create hotel services from facilities
        let hotelServices: string[] = [];
        if (service.facilities) {
          hotelServices = service.facilities
            .split(/[,\n]/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0);
          
          // Add standard hotel services at the beginning
          hotelServices.unshift('Daily Housekeeping');
          hotelServices.unshift('Complimentary Breakfast');
        } else {
          // Default hotel services
          hotelServices = [
            'Complimentary Breakfast',
            'Daily Housekeeping',
            'Free WiFi',
            'Room Service',
            'Concierge Service'
          ];
        }
        
        setFormData({
          ...formData,
          serviceId,
          tourName: `Hotel Booking - ${service.hotel_name}`,
          basePrice: 0,
          includedServices: hotelServices
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
    // Validate that start date is not in the past
    const selectedDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    if (selectedDate < today) {
      alert('Start date cannot be in the past. Please select a future date.');
      return;
    }
    
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

  const handleEndDateChange = (endDate: string) => {
    // Calculate duration based on start and end dates
    if (formData.startDate && endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(endDate);
      
      // Validate that end date is after start date
      if (end < start) {
        alert('End date must be after start date.');
        return;
      }
      
      // Calculate days difference (inclusive)
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
      
      setFormData({ ...formData, endDate, durationDays: diffDays });
    } else {
      setFormData({ ...formData, endDate });
    }
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

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleCreateInvoice = (quotation: any) => {
    setSelectedQuotationForInvoice(quotation);
    setShowInvoiceModal(true);
  };

  const handleSubmitInvoice = async (invoiceData: any) => {
    try {
      console.log('Submitting invoice data:', invoiceData);
      
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      const data = await res.json();
      console.log('Invoice API response:', data);
      
      if (res.ok) {
        alert(`✅ Invoice ${data.invoice.invoice_number} created successfully!`);
        
        // Ask if user wants to send the invoice via email
        if (confirm('Would you like to send this invoice to the customer via email?')) {
          await handleSendInvoice(data.invoice.invoice_number);
        }
        
        setShowInvoiceModal(false);
        setSelectedQuotationForInvoice(null);
        fetchInvoices();
        
        // Preview invoice
        if (confirm('Would you like to preview the invoice?')) {
          window.open(`/invoice/${data.invoice.invoice_number}`, '_blank');
        }
      } else {
        const errorMsg = data.details ? `${data.error}\n\nDetails: ${data.details}` : data.error;
        alert(`❌ Error: ${errorMsg}`);
        console.error('Invoice creation error:', data);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please check the browser console for details.');
    }
  };

  const handleSendInvoice = async (invoiceNumber: string) => {
    try {
      const res = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceNumber })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`✅ Invoice sent to ${data.email}`);
        fetchInvoices();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice. Please try again.');
    }
  };

  const getQuotationInvoices = (quotationId: number) => {
    return invoices.filter(inv => inv.quotation_id === quotationId);
  };

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalVehicleImageUrls: string[] | null = null;
      
      // Upload vehicle images if selected (for vehicle service type only)
      if (formData.serviceType === 'vehicle' && vehicleImageInputRef.current?.files && vehicleImageInputRef.current.files.length > 0) {
        console.log('📤 Starting vehicle image uploads...');
        alert(`Starting upload of ${vehicleImageInputRef.current.files.length} vehicle images...`);
        setIsUploadingImages(true);
        const files = vehicleImageInputRef.current.files;
        const uploadedUrls: string[] = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          console.log(`Uploading vehicle image ${i + 1}/${files.length}: ${file.name}`);
          
          // Create FormData for file upload
          const formDataObj = new FormData();
          formDataObj.append('file', file);
          formDataObj.append('folder', 'zamzam_tours/quotations');
          
          try {
            // Upload to our API endpoint which uses server-side Cloudinary credentials
            const res = await fetch('/api/cloudinary/upload', {
              method: 'POST',
              body: formDataObj
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.url) {
                uploadedUrls.push(data.url);
                console.log(`✅ Image ${i + 1} uploaded: ${data.url}`);
              }
            } else {
              const errorData = await res.json();
              console.error('Upload error:', errorData);
              alert(`Upload error: ${errorData.error}\n\nDetails: ${errorData.details || ''}`);
              setIsUploadingImages(false);
              return;
            }
          } catch (error) {
            console.error(`Error uploading image ${i + 1}:`, error);
            alert(`Failed to upload image ${file.name}. Please try again.`);
            setIsUploadingImages(false);
            return;
          }
        }
        
        if (uploadedUrls.length > 0) {
          finalVehicleImageUrls = uploadedUrls;
          console.log('✅ All vehicle images uploaded:', finalVehicleImageUrls);
          alert(`✅ Images uploaded successfully`);
        }
        setIsUploadingImages(false);
      } else {
        console.log('No vehicle images to upload. Service type:', formData.serviceType, 'Files:', vehicleImageInputRef.current?.files?.length);
      }
      
      // Auto-generate tourName for transfers if not set
      let finalFormData = { ...formData };
      if ((formData.serviceType === 'airport-transfer' || formData.serviceType === 'all-island-transfer') && !formData.tourName && formData.pickupLocation && formData.dropoffLocation) {
        finalFormData.tourName = `${formData.serviceType === 'airport-transfer' ? 'Airport Transfer' : 'All Island Transfer'}: ${formData.pickupLocation} → ${formData.dropoffLocation}`;
      }
      
      // Prepare quotation data with service details
      const quotationData = {
        ...finalFormData,
        serviceDetails: (window as any).currentServiceDetails || null,
        vehicleImageUrls: finalVehicleImageUrls
      };
      
      console.log('Form submission - vehicleImageUrls to send:', finalVehicleImageUrls);
      console.log('Creating quotation with data:', quotationData);
      
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
        setVehicleImageUrls([]);
        
        // Reset file input
        if (vehicleImageInputRef.current) {
          vehicleImageInputRef.current.value = '';
        }
      } else {
        alert('Error creating quotation: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation');
      setIsUploadingImages(false);
    }
  };

  const handleDaysChange = (days: number) => {
    setNewTourData({ ...newTourData, days });
    
    // Adjust itinerary array based on days
    const currentLength = dayItineraries.length;
    if (days > currentLength) {
      // Add new days
      const newDays = Array.from({ length: days - currentLength }, (_, i) => ({
        day: currentLength + i + 1,
        title: '',
        description: '',
        activities: '',
        image: ''
      }));
      setDayItineraries([...dayItineraries, ...newDays]);
    } else if (days < currentLength) {
      // Remove extra days
      setDayItineraries(dayItineraries.slice(0, days));
    }
  };

  const updateDayItinerary = (dayIndex: number, field: string, value: string) => {
    const updated = [...dayItineraries];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setDayItineraries(updated);
  };

  const handleCreateNewTour = async () => {
    if (!newTourData.tourName) {
      alert('Tour name is required');
      return;
    }

    setIsCreatingTour(true);
    try {
      const res = await fetch('/api/tours/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourName: newTourData.tourName,
          description: newTourData.description,
          price: newTourData.price ? parseFloat(newTourData.price) : null,
          days: newTourData.days,
          nights: newTourData.days > 0 ? newTourData.days - 1 : 0,
          image: newTourData.image,
          highlights: newTourData.highlights,
          includings: newTourData.includings,
          itinerary: dayItineraries,
          saveType: tourSaveType,
          quotationId: formData.serviceType === 'tour' ? formData.serviceId : null,
          createdBy: 'admin'
        })
      });

      const data = await res.json();
      
      if (data.success) {
        alert(`✅ Tour ${tourSaveType === 'package' ? 'package' : 'saved'} successfully!`);
        
        // If saved as package, refresh tours list and select it
        if (tourSaveType === 'package') {
          await loadServiceData();
          handleServiceSelect(data.package.packageId);
        }
        
        // Reset form and close modal
        setNewTourData({
          tourName: '',
          description: '',
          price: '',
          days: 1,
          image: '',
          highlights: '',
          includings: ''
        });
        setDayItineraries([{
          day: 1,
          title: '',
          description: '',
          activities: '',
          image: ''
        }]);
        setShowCreateTourModal(false);
      } else {
        alert('Error creating tour: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      alert('Failed to create tour');
    } finally {
      setIsCreatingTour(false);
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
                <h1 className="text-3xl font-bold text-gray-900">Tour Itineraries</h1>
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
                              onClick={() => handleCreateInvoice(quotation)}
                              className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 text-xs font-medium"
                              title="Create invoice for payment"
                            >
                              💳 Invoice
                            </button>
                            {getQuotationInvoices(quotation.quotation_id).length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                {getQuotationInvoices(quotation.quotation_id).length} Invoice{getQuotationInvoices(quotation.quotation_id).length > 1 ? 's' : ''}
                              </span>
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
                        <div className="space-y-3">
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
                          <button
                            type="button"
                            onClick={() => setShowCreateTourModal(true)}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition"
                          >
                            ➕ Create New Tour Package
                          </button>
                        </div>
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
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.startDate}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (selectedDate < today) {
                          alert('Transfer date cannot be in the past. Please select a future date.');
                          return;
                        }
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
                      min={new Date().toISOString().split('T')[0]}
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
                      min={formData.startDate}
                      value={formData.endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      title="Select return date - duration will be calculated automatically"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.durationDays}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                      className="w-full border rounded px-3 py-2 bg-gray-50"
                      readOnly
                      title="Auto-calculated based on start and end dates"
                    />
                  </div>
                </div>
              )}

              {(formData.serviceType === 'tour' || (formData.serviceType === 'vehicle' && formData.withDriver)) && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Adults</label>
                      <input
                        type="number"
                        min="1"
                        max={formData.serviceType === 'vehicle' && selectedService?.capacity ? selectedService.capacity : undefined}
                        value={formData.numAdults}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (formData.serviceType === 'vehicle' && selectedService?.capacity) {
                            const totalPeople = value + formData.numChildren + formData.numInfants;
                            if (totalPeople > selectedService.capacity) {
                              alert(`Total passengers (${totalPeople}) exceeds vehicle capacity (${selectedService.capacity}). Please select a larger vehicle or reduce the number of passengers.`);
                              return;
                            }
                          }
                          setFormData({...formData, numAdults: value});
                        }}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Children</label>
                      <input
                        type="number"
                        min="0"
                        max={formData.serviceType === 'vehicle' && selectedService?.capacity ? selectedService.capacity : undefined}
                        value={formData.numChildren}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (formData.serviceType === 'vehicle' && selectedService?.capacity) {
                            const totalPeople = formData.numAdults + value + formData.numInfants;
                            if (totalPeople > selectedService.capacity) {
                              alert(`Total passengers (${totalPeople}) exceeds vehicle capacity (${selectedService.capacity}). Please select a larger vehicle or reduce the number of passengers.`);
                              return;
                            }
                          }
                          setFormData({...formData, numChildren: value});
                        }}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Infants</label>
                      <input
                        type="number"
                        min="0"
                        max={formData.serviceType === 'vehicle' && selectedService?.capacity ? selectedService.capacity : undefined}
                        value={formData.numInfants}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (formData.serviceType === 'vehicle' && selectedService?.capacity) {
                            const totalPeople = formData.numAdults + formData.numChildren + value;
                            if (totalPeople > selectedService.capacity) {
                              alert(`Total passengers (${totalPeople}) exceeds vehicle capacity (${selectedService.capacity}). Please select a larger vehicle or reduce the number of passengers.`);
                              return;
                            }
                          }
                          setFormData({...formData, numInfants: value});
                        }}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>
                  {formData.serviceType === 'vehicle' && selectedService?.capacity && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Vehicle Capacity:</strong> {selectedService.capacity} passengers maximum
                        {' | '}
                        <strong>Current Total:</strong> {formData.numAdults + formData.numChildren + formData.numInfants} passengers
                        {(formData.numAdults + formData.numChildren + formData.numInfants) > selectedService.capacity && (
                          <span className="text-red-600 font-semibold"> ⚠️ Exceeds capacity! Select a larger vehicle.</span>
                        )}
                      </p>
                    </div>
                  )}
                </>
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
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Driver Option</label>
                    <select
                      value={formData.withDriver ? 'with-driver' : 'self-drive'}
                      onChange={(e) => {
                        const withDriver = e.target.value === 'with-driver';
                        setFormData({...formData, withDriver});
                        
                        // Update currentServiceDetails with new rental_type
                        if ((window as any).currentServiceDetails) {
                          (window as any).currentServiceDetails = {
                            ...(window as any).currentServiceDetails,
                            rental_type: withDriver ? 'with-driver' : 'self-drive'
                          };
                        }
                      }}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="with-driver">With Driver</option>
                      <option value="self-drive">Self Drive (Without Driver)</option>
                    </select>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                    <label className="block text-sm font-medium mb-2">🚗 Vehicle Images (Optional)</label>
                    <p className="text-xs text-gray-600 mb-3">Select custom images of the actual vehicle to be sent (e.g., different color/variants). Images will be uploaded when you submit the form. If not provided, the default package images will be shown.</p>
                    <div className="space-y-2">
                      <input
                        ref={vehicleImageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          // Just show preview of selected files
                          const files = e.target.files;
                          console.log('Files selected:', files?.length);
                          if (files && files.length > 0) {
                            // Create preview URLs using FileReader
                            const previewUrls: string[] = [];
                            for (let i = 0; i < files.length; i++) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  previewUrls.push(event.target.result as string);
                                  if (previewUrls.length === files.length) {
                                    // All files have been read
                                    setVehicleImageUrls(previewUrls);
                                    console.log('Preview URLs set:', previewUrls);
                                  }
                                }
                              };
                              reader.readAsDataURL(files[i]);
                            }
                          }
                        }}
                        className="w-full border rounded px-3 py-2"
                      />
                      <p className="text-xs text-gray-500">You can select multiple images at once</p>
                    </div>

                    {vehicleImageUrls && vehicleImageUrls.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-3">Uploaded Images ({vehicleImageUrls.length}):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {vehicleImageUrls.map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img src={url} alt={`Vehicle ${idx + 1}`} className="w-full h-24 object-cover rounded border-2 border-emerald-200" />
                              <button
                                type="button"
                                onClick={() => setVehicleImageUrls(vehicleImageUrls.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
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
                      {formData.serviceType === 'vehicle' ? 'Price per Day *' : 
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
                      placeholder={formData.serviceType === 'vehicle' ? '100.00' : '500.00'}
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
                    {formData.currency} {(() => {
                      if (formData.serviceType === 'tour') {
                        const adultTotal = formData.basePrice * formData.numAdults;
                        const childTotal = formData.basePrice * formData.numChildren * 0.7;
                        return (adultTotal + childTotal).toFixed(2);
                      } else {
                        return (formData.basePrice * formData.durationDays).toFixed(2);
                      }
                    })()}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    {formData.serviceType === 'tour' ? (
                      <div className="mb-1">
                        {formData.numAdults} Adult{formData.numAdults > 1 ? 's' : ''} × {formData.basePrice.toFixed(2)}
                        {formData.numChildren > 0 && ` + ${formData.numChildren} Child${formData.numChildren > 1 ? 'ren' : ''} × ${(formData.basePrice * 0.7).toFixed(2)}`}
                      </div>
                    ) : (
                      <div className="mb-1">
                        {formData.basePrice.toFixed(2)} × {formData.durationDays} day{formData.durationDays > 1 ? 's' : ''}
                      </div>
                    )}
                    Deposit: {formData.currency} {(() => {
                      let total;
                      if (formData.serviceType === 'tour') {
                        const adultTotal = formData.basePrice * formData.numAdults;
                        const childTotal = formData.basePrice * formData.numChildren * 0.7;
                        total = adultTotal + childTotal;
                      } else {
                        total = formData.basePrice * formData.durationDays;
                      }
                      return (total * formData.depositPercentage / 100).toFixed(2);
                    })()}
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
                      disabled={isUploadingImages}
                      className={`px-4 sm:px-6 py-2 rounded-lg ${isUploadingImages ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >
                      {isUploadingImages ? 'Uploading Images...' : 'Create Quotation'}
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

      {/* Invoice Creation Modal */}
      {showInvoiceModal && selectedQuotationForInvoice && (
        <InvoiceModal
          quotation={selectedQuotationForInvoice}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedQuotationForInvoice(null);
          }}
          onSubmit={handleSubmitInvoice}
        />
      )}

      {/* Create Tour Modal */}
      {showCreateTourModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Tour Package</h2>
              <button
                onClick={() => setShowCreateTourModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
                type="button"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateNewTour(); }} className="space-y-5">
              {/* Save Type Selection */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">How would you like to save this tour?</p>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="package"
                      checked={tourSaveType === 'package'}
                      onChange={(e) => setTourSaveType(e.target.value as 'package')}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      <strong>Save as Tour Package</strong>
                      <p className="text-xs text-gray-600">Can be reused for other quotations</p>
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="one-time"
                      checked={tourSaveType === 'one-time'}
                      onChange={(e) => setTourSaveType(e.target.value as 'one-time')}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      <strong>Save as One-Time Tour</strong>
                      <p className="text-xs text-gray-600">Only for this quotation</p>
                    </span>
                  </label>
                </div>
              </div>

              {/* Basic Tour Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={newTourData.tourName}
                  onChange={(e) => setNewTourData({ ...newTourData, tourName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5-Day Cultural Triangle Tour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={newTourData.description}
                  onChange={(e) => setNewTourData({ ...newTourData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  placeholder="Describe the tour package..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTourData.price}
                    onChange={(e) => setNewTourData({ ...newTourData, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="30"
                    value={newTourData.days}
                    onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>

              <CloudinaryUpload
                currentImageUrl={newTourData.image}
                onUploadSuccess={(url) => setNewTourData({ ...newTourData, image: Array.isArray(url) ? url[0] : url })}
                folder="zamzam-tours/packages"
                label="Package Main Image"
              />

              {/* Day-by-Day Itinerary */}
              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Day-by-Day Itinerary</label>
                <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4">
                  {dayItineraries.map((dayData, index) => (
                    <div key={index} className={`pb-4 ${index < dayItineraries.length - 1 ? 'border-b border-gray-200' : ''}`}>
                      <div className="flex items-center gap-2 mb-3 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <span className="font-semibold text-emerald-900 text-sm">Day {dayData.day}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Day Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Arrival in Colombo"
                            value={dayData.title}
                            onChange={(e) => updateDayItinerary(index, 'title', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                          <textarea
                            required
                            rows={2}
                            placeholder="Brief overview of the day"
                            value={dayData.description}
                            onChange={(e) => updateDayItinerary(index, 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-vertical"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Activities (one per line) *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Visit temple&#10;City tour&#10;Beach relaxation"
                            value={dayData.activities}
                            onChange={(e) => updateDayItinerary(index, 'activities', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-vertical"
                          />
                        </div>

                        <CloudinaryUpload
                          currentImageUrl={dayData.image || ''}
                          onUploadSuccess={(url) => updateDayItinerary(index, 'image', Array.isArray(url) ? url[0] : url)}
                          folder="zamzam-tours/itinerary"
                          label={`Day ${dayData.day} Image (Optional)`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (places visited - one per line) *</label>
                <textarea
                  required
                  value={newTourData.highlights}
                  onChange={(e) => setNewTourData({ ...newTourData, highlights: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  rows={4}
                  placeholder="Sigiriya Rock Fortress&#10;Temple of the Tooth&#10;Tea Plantations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (one per line) *</label>
                <textarea
                  required
                  value={newTourData.includings}
                  onChange={(e) => setNewTourData({ ...newTourData, includings: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  rows={4}
                  placeholder="Private A/C Vehicle&#10;Accommodation&#10;Breakfast & Dinner&#10;English speaking guide"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateTourModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTour || !newTourData.tourName}
                  className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                    isCreatingTour || !newTourData.tourName
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
                  }`}
                >
                  {isCreatingTour ? 'Creating...' : `✅ Create ${tourSaveType === 'package' ? 'Package' : 'Tour'}`}
                </button>
              </div>
            </form>
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

// Invoice Modal Component
function InvoiceModal({ quotation, onClose, onSubmit }: { quotation: any; onClose: () => void; onSubmit: (data: any) => void }) {
  const [invoiceData, setInvoiceData] = useState({
    quotationId: quotation.quotation_id,
    paymentType: 'bank-transfer',
    paymentReference: '',
    paidAmount: '',
    notes: '',
    createdBy: 'admin'
  });

  const [depositPercentage, setDepositPercentage] = useState(() => {
    const percentage = quotation.deposit_percentage;
    return percentage && !isNaN(parseFloat(percentage)) ? parseFloat(percentage) : 30;
  });

  const totalAmount = parseFloat(quotation.total_amount || 0);
  const depositAmount = (totalAmount * depositPercentage) / 100;
  const remainingAmount = totalAmount - depositAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceData.paidAmount || parseFloat(invoiceData.paidAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    onSubmit({
      ...invoiceData,
      depositPercentage
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl flex flex-col" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        {/* Header - Fixed */}
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-t-lg flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Create Invoice</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 pt-6 pb-4">
          {/* Quotation Summary */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-base mb-2 text-emerald-700">Quotation Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Quotation #:</span>
                <span className="ml-2 font-semibold">{quotation.quotation_number}</span>
              </div>
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2 font-semibold">{quotation.customer_name}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Service:</span>
                <span className="ml-2">{quotation.tour_name}</span>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-base mb-2 text-blue-700">Pricing Details</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-base">{quotation.currency} {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Deposit:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={depositPercentage}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === '' ? 0 : parseFloat(val);
                      setDepositPercentage(Math.min(100, Math.max(0, isNaN(num) ? 0 : num)));
                    }}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  />
                  <span className="text-gray-600">%</span>
                </div>
                <span className="font-semibold text-green-600">{quotation.currency} {depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Balance:</span>
                <span className="font-semibold text-orange-600">{quotation.currency} {remainingAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base text-gray-800">Payment Information</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <select
                value={invoiceData.paymentType}
                onChange={(e) => setInvoiceData({ ...invoiceData, paymentType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="bank-transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Paid Amount ({quotation.currency}) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={totalAmount}
                value={invoiceData.paidAmount}
                onChange={(e) => setInvoiceData({ ...invoiceData, paidAmount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder={`Enter amount (e.g., ${depositAmount.toFixed(2)} for deposit)`}
                required
              />
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceData({ ...invoiceData, paidAmount: depositAmount.toFixed(2) })}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
                >
                  Set Deposit ({depositPercentage}%)
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceData({ ...invoiceData, paidAmount: totalAmount.toFixed(2) })}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
                >
                  Set Full Amount
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment Reference (Optional)
              </label>
              <input
                type="text"
                value={invoiceData.paymentReference}
                onChange={(e) => setInvoiceData({ ...invoiceData, paymentReference: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="Transaction ID, Check number, etc."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                placeholder="Any additional notes for this payment..."
              />
            </div>
          </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-lg flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
            >
              💳 Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
