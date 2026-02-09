// API endpoint for quotations management
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';
import { logServerAction, logServerError } from '../../../src/lib/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // GET requires authentication (admin viewing quotations)
        return authMiddleware(getQuotations)(req, res);
      case 'POST':
        // POST is public (customers creating quotations)
        return await createQuotation(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Quotations API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/quotations - Get all quotations with filters
async function getQuotations(req: AuthRequest, res: NextApiResponse) {
  const { status, email, search, limit = '50', offset = '0' } = req.query;

  try {
    let query = `
      SELECT 
        quotation_id,
        quotation_number,
        customer_name,
        customer_email,
        customer_phone,
        tour_name,
        start_date,
        end_date,
        duration_days,
        num_adults,
        num_children,
        total_amount,
        currency,
        status,
        valid_until,
        sent_at,
        viewed_at,
        accepted_at,
        created_at,
        source,
        package_id,
        service_type,
        service_id,
        service_details
      FROM quotations
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    // Filter by status
    if (status && status !== 'all') {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Filter by email
    if (email) {
      query += ` AND customer_email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
      paramCount++;
    }

    // Search across multiple fields
    if (search) {
      query += ` AND (
        customer_name ILIKE $${paramCount} OR 
        customer_email ILIKE $${paramCount} OR
        quotation_number ILIKE $${paramCount} OR
        tour_name ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Order by latest first
    query += ` ORDER BY created_at DESC`;

    // Pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM quotations WHERE 1=1';
    const countParams: any[] = [];
    let countParamNum = 1;

    if (status && status !== 'all') {
      countQuery += ` AND status = $${countParamNum}`;
      countParams.push(status);
      countParamNum++;
    }
    if (email) {
      countQuery += ` AND customer_email ILIKE $${countParamNum}`;
      countParams.push(`%${email}%`);
      countParamNum++;
    }
    if (search) {
      countQuery += ` AND (
        customer_name ILIKE $${countParamNum} OR 
        customer_email ILIKE $${countParamNum} OR
        quotation_number ILIKE $${countParamNum} OR
        tour_name ILIKE $${countParamNum}
      )`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    return res.status(200).json({
      quotations: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: totalCount > parseInt(offset as string) + result.rows.length
      }
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return res.status(500).json({ error: 'Failed to fetch quotations' });
  }
}

// POST /api/quotations - Create new quotation
async function createQuotation(req: NextApiRequest, res: NextApiResponse) {
  logServerAction('QUOTATION_API', 'POST /api/quotations', {
    customerEmail: req.body.customerEmail,
    serviceType: req.body.serviceType,
    source: req.body.source
  });
  
  const {
    serviceType,
    serviceId,
    serviceDetails,
    vehicleImageUrls,
    customerName,
    customerEmail,
    customerPhone,
    customerCountry,
    packageId,
    tourName,
    startDate,
    endDate,
    durationDays,
    numAdults = 1,
    numChildren = 0,
    numInfants = 0,
    accommodationType = 'standard',
    specialRequests,
    source = 'website',
    createdBy = 'system',
    basePrice,
    depositPercentage = 30,
    includedServices
  } = req.body;

  // Comprehensive validation
  const errors: string[] = [];
  
  // Required fields
  if (!customerName?.trim()) errors.push('Customer name is required');
  if (!customerEmail?.trim()) errors.push('Customer email is required');
  if (serviceType === 'tour' && !tourName?.trim()) errors.push('Tour name is required');
  if (!startDate) errors.push('Start date is required');
  if (!endDate) errors.push('End date is required');
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (customerEmail && !emailRegex.test(customerEmail.trim())) {
    errors.push('Invalid email format');
  }
  
  // Date validation
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime())) errors.push('Invalid start date');
    if (isNaN(end.getTime())) errors.push('Invalid end date');
    
    if (start.getTime() && end.getTime() && end < start) {
      errors.push('End date must be after or equal to start date');
    }
  }
  
  // Numeric validation
  if (numAdults < 1) errors.push('At least 1 adult is required');
  if (numChildren < 0) errors.push('Number of children cannot be negative');
  if (numInfants < 0) errors.push('Number of infants cannot be negative');
  if (durationDays < 1) errors.push('Duration must be at least 1 day');
  if (basePrice && parseFloat(basePrice) < 0) errors.push('Price cannot be negative');
  if (depositPercentage < 0 || depositPercentage > 100) {
    errors.push('Deposit percentage must be between 0 and 100');
  }
  
  if (errors.length > 0) {
    logServerError('QUOTATION_API', 'Validation failed', errors.join('; '), {
      customerEmail: customerEmail,
      serviceType: serviceType
    });
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors
    });
  }

  try {
    // Calculate pricing based on service type and parameters
    let pricing;
    
    if (basePrice) {
      // Calculate based on service type
      let calculatedTotal = 0;
      let calculatedBasePrice = 0;
      
      if (serviceType === 'tour') {
        // For tours: basePrice is per person per day or total per person
        // Assume basePrice is per person for the entire tour
        calculatedBasePrice = parseFloat(basePrice) * numAdults;
        
        // Children pricing (70% of adult price)
        if (numChildren > 0) {
          calculatedBasePrice += (parseFloat(basePrice) * numChildren * 0.7);
        }
        // Infants are free
        
        calculatedTotal = calculatedBasePrice;
      } else if (serviceType === 'vehicle') {
        // For vehicles: basePrice is per day
        calculatedBasePrice = parseFloat(basePrice) * durationDays;
        calculatedTotal = calculatedBasePrice;
      } else if (serviceType === 'hotel') {
        // For hotels: basePrice is per night per room
        const numRooms = req.body.numRooms || 1;
        calculatedBasePrice = parseFloat(basePrice) * durationDays * numRooms;
        calculatedTotal = calculatedBasePrice;
      } else {
        // For other services (transfers, etc.): basePrice is total
        calculatedBasePrice = parseFloat(basePrice);
        calculatedTotal = calculatedBasePrice;
      }
      
      pricing = {
        basePrice: calculatedBasePrice,
        accommodationUpgrade: 0,
        discount: 0,
        discountPercentage: 0,
        subtotal: calculatedTotal,
        total: calculatedTotal
      };
    } else {
      // Use the old calculation method if no basePrice provided
      pricing = calculatePricing({
        packageId,
        numAdults,
        numChildren,
        numInfants,
        durationDays,
        accommodationType,
        startDate
      });
    }

    logServerAction('QUOTATION_API', 'Pricing calculated', {
      basePrice: pricing.basePrice,
      total: pricing.total,
      serviceType: serviceType,
      numAdults: numAdults,
      numChildren: numChildren
    });

    // Generate quotation number
    const quotationNumberResult = await pool.query('SELECT generate_quotation_number() as number');
    const quotationNumber = quotationNumberResult.rows[0].number;

    // Set valid until date (14 days from creation)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 14); // Valid for 14 days

    // Calculate deposit and balance using the depositPercentage from request
    const depositAmount = pricing.total * (depositPercentage / 100);
    const balanceAmount = pricing.total - depositAmount;

    // Set payment due dates
    const depositDueDate = new Date(startDate);
    depositDueDate.setDate(depositDueDate.getDate() - 30); // 30 days before tour

    const balanceDueDate = new Date(startDate);
    balanceDueDate.setDate(balanceDueDate.getDate() - 14); // 14 days before tour

    // Fetch services from package or vehicle based on service type
    let finalIncludedServices: string[] = [];
    
    if (includedServices && includedServices.length > 0) {
      // Use provided services if explicitly given
      finalIncludedServices = includedServices;
    } else {
      // Fetch services from the relevant package or vehicle
      if (serviceType === 'tour' && (packageId || serviceId)) {
        try {
          const pkgId = packageId || serviceId;
          const pkgResult = await pool.query(
            'SELECT includings FROM package WHERE package_id = $1',
            [pkgId]
          );
          
          if (pkgResult.rows.length > 0 && pkgResult.rows[0].includings) {
            // Parse includings - assuming it's a comma or newline separated string
            const includingsText = pkgResult.rows[0].includings;
            finalIncludedServices = includingsText
              .split(/[,\n]/)
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);
          }
        } catch (err) {
          console.error('Error fetching package services:', err);
        }
      } else if (serviceType === 'vehicle' && serviceId) {
        try {
          const vehicleResult = await pool.query(
            'SELECT vehicle_name, vehicle_type, available_for FROM vehicle WHERE vehicle_id = $1',
            [serviceId]
          );
          
          if (vehicleResult.rows.length > 0) {
            const vehicle = vehicleResult.rows[0];
            // Create vehicle rental services
            finalIncludedServices = [
              `${vehicle.vehicle_name} - ${vehicle.vehicle_type}`,
              'Comprehensive Insurance Coverage',
              'Unlimited Mileage (within daily limit)',
              '24/7 Roadside Assistance',
              'Free Additional Driver',
              'GPS Navigation System',
              'Child Seat Available (on request)',
              'Airport Pickup & Drop-off'
            ];
            
            if (vehicle.available_for) {
              finalIncludedServices.push(`Available for: ${vehicle.available_for}`);
            }
          }
        } catch (err) {
          console.error('Error fetching vehicle services:', err);
        }
      } else if (serviceType === 'hotel' && serviceId) {
        try {
          const hotelResult = await pool.query(
            'SELECT hotel_name, facilities FROM hotel WHERE hotel_id = $1',
            [serviceId]
          );
          
          if (hotelResult.rows.length > 0 && hotelResult.rows[0].facilities) {
            const facilities = hotelResult.rows[0].facilities;
            finalIncludedServices = facilities
              .split(/[,\n]/)
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);
            
            // Add standard hotel services
            finalIncludedServices.unshift('Daily Housekeeping');
            finalIncludedServices.unshift('Complimentary Breakfast');
          }
        } catch (err) {
          console.error('Error fetching hotel services:', err);
        }
      }
      
      // If still no services, use default tour services
      if (finalIncludedServices.length === 0) {
        finalIncludedServices = [
          'Private A/C Vehicle with English-speaking Driver',
          'Accommodation (Double/Twin Rooms)',
          'Daily Breakfast',
          'Airport Pickup & Drop-off',
          'All Fuel, Parking & Highway Charges',
          'Driver Accommodation & Meals',
          'Government Taxes'
        ];
      }
    }

    logServerAction('QUOTATION_API', 'Included services fetched', {
      serviceCount: finalIncludedServices.length,
      serviceType: serviceType
    });

    // Insert quotation
    const insertQuery = `
      INSERT INTO quotations (
        quotation_number,
        customer_name,
        customer_email,
        customer_phone,
        customer_country,
        package_id,
        tour_name,
        start_date,
        end_date,
        duration_days,
        num_adults,
        num_children,
        num_infants,
        base_price,
        accommodation_type,
        accommodation_upgrade,
        discount_amount,
        discount_percentage,
        subtotal,
        total_amount,
        currency,
        deposit_percentage,
        deposit_amount,
        balance_amount,
        deposit_due_date,
        balance_due_date,
        valid_until,
        included_services,
        special_requests,
        source,
        created_by,
        status,
        service_type,
        service_id,
        service_details,
        vehicle_image_urls
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36
      ) RETURNING *
    `;

    const values = [
      quotationNumber,
      customerName,
      customerEmail,
      customerPhone || null,
      customerCountry || null,
      serviceType === 'tour' ? (packageId || serviceId || null) : null, // Only set package_id for tours
      tourName,
      startDate,
      endDate,
      durationDays,
      numAdults,
      numChildren,
      numInfants,
      pricing.basePrice,
      accommodationType,
      pricing.accommodationUpgrade,
      pricing.discount,
      pricing.discountPercentage,
      pricing.subtotal,
      pricing.total,
      'USD',
      depositPercentage,
      depositAmount,
      balanceAmount,
      depositDueDate,
      balanceDueDate,
      validUntil,
      finalIncludedServices,
      specialRequests || null,
      source,
      createdBy,
      'draft',
      serviceType || 'tour',
      serviceId || packageId || null,
      serviceDetails ? JSON.stringify(serviceDetails) : null,
      vehicleImageUrls && vehicleImageUrls.length > 0 ? vehicleImageUrls : null
    ];

    logServerAction('QUOTATION_API', 'Inserting quotation to DB', {
      quotationNumber: quotationNumber,
      customerEmail: customerEmail,
      hasVehicleImages: !!vehicleImageUrls && vehicleImageUrls.length > 0,
      imageCount: vehicleImageUrls?.length || 0
    });

    const result = await pool.query(insertQuery, values);
    
    if (!result.rows || result.rows.length === 0) {
      throw new Error('Failed to insert quotation - no data returned');
    }
    
    const quotation = result.rows[0];

    logServerAction('QUOTATION_API', 'Quotation created successfully', {
      quotationNumber: quotation.quotation_number,
      quotationId: quotation.quotation_id,
      customerEmail: quotation.customer_email,
      totalAmount: quotation.total_amount,
      depositAmount: quotation.deposit_amount
    });

    return res.status(201).json({
      success: true,
      quotation: {
        id: quotation.quotation_id,
        quotationNumber: quotation.quotation_number,
        customerName: quotation.customer_name,
        customerEmail: quotation.customer_email,
        tourName: quotation.tour_name,
        totalAmount: quotation.total_amount,
        depositAmount: quotation.deposit_amount,
        validUntil: quotation.valid_until,
        status: quotation.status
      },
      message: 'Quotation created successfully'
    });

  } catch (error) {
    logServerError('QUOTATION_API', 'Error creating quotation', error instanceof Error ? error : new Error(String(error)));
    
    // Handle specific database errors
    if (error instanceof Error) {
      // Duplicate quotation number
      if (error.message.includes('duplicate key') && error.message.includes('quotation_number')) {
        return res.status(409).json({ 
          error: 'Quotation number already exists. Please try again.',
          details: 'Database conflict'
        });
      }
      
      // Foreign key constraint
      if (error.message.includes('foreign key constraint')) {
        return res.status(400).json({ 
          error: 'Invalid package or service reference',
          details: error.message
        });
      }
      
      // Not null constraint
      if (error.message.includes('null value') && error.message.includes('violates not-null')) {
        return res.status(400).json({ 
          error: 'Missing required database field',
          details: error.message
        });
      }
    }
    
    return res.status(500).json({ 
      error: 'Failed to create quotation',
      details: error instanceof Error ? error.message : 'Unknown database error'
    });
  }
}

// Pricing calculation function
function calculatePricing(params: any) {
  const {
    packageId,
    numAdults,
    numChildren,
    numInfants,
    durationDays,
    accommodationType,
    startDate
  } = params;

  // Base price per person per day (simplified - should come from package table)
  let basePricePerDay = 100; // $100 per person per day
  
  // Calculate base price
  let basePrice = basePricePerDay * durationDays * numAdults;
  
  // Children pricing (70% of adult price)
  if (numChildren > 0) {
    basePrice += (basePricePerDay * durationDays * numChildren * 0.7);
  }
  
  // Infants (free)
  // numInfants are free
  
  // Accommodation upgrade
  let accommodationUpgrade = 0;
  if (accommodationType === 'deluxe') {
    accommodationUpgrade = durationDays * numAdults * 50; // $50/night per person
  } else if (accommodationType === 'luxury') {
    accommodationUpgrade = durationDays * numAdults * 100; // $100/night per person
  }
  
  // Seasonal pricing
  let seasonalMultiplier = 1.0;
  const tourDate = new Date(startDate);
  const month = tourDate.getMonth() + 1;
  
  // Peak season: December-March
  if (month >= 12 || month <= 3) {
    seasonalMultiplier = 1.2; // 20% increase
  }
  
  // Calculate subtotal
  let subtotal = (basePrice * seasonalMultiplier) + accommodationUpgrade;
  
  // Group discounts
  let discountPercentage = 0;
  let discountAmount = 0;
  const totalPeople = numAdults + numChildren;
  
  if (totalPeople >= 7) {
    discountPercentage = 15; // 15% off for 7+ people
  } else if (totalPeople >= 4) {
    discountPercentage = 10; // 10% off for 4-6 people
  } else if (totalPeople >= 2) {
    discountPercentage = 5; // 5% off for 2-3 people
  }
  
  discountAmount = subtotal * (discountPercentage / 100);
  
  // Final total
  const total = subtotal - discountAmount;
  
  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    accommodationUpgrade: parseFloat(accommodationUpgrade.toFixed(2)),
    seasonalAdjustment: parseFloat(((basePrice * seasonalMultiplier) - basePrice).toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    discountPercentage,
    discount: parseFloat(discountAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}
