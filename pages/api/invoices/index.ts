import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return createInvoice(req, res);
  } else if (req.method === 'GET') {
    return getInvoices(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function createInvoice(req: NextApiRequest, res: NextApiResponse) {
  const client = await pool.connect();
  
  try {
    const {
      quotationId,
      paymentType,
      paymentReference,
      paidAmount,
      depositPercentage,
      notes,
      createdBy
    } = req.body;

    console.log('Creating invoice with data:', { quotationId, paymentType, paidAmount, depositPercentage });

    // Validate required fields
    if (!quotationId || !paymentType || !paidAmount) {
      return res.status(400).json({ 
        error: 'Missing required fields: quotationId, paymentType, paidAmount' 
      });
    }

    // Fetch the quotation details
    const quotationResult = await client.query(
      `SELECT q.*, 
        -- Tour/Package details
        p.package_name,
        p.description as package_description,
        p.highlights as package_highlights,
        p.includings as package_includings,
        -- Vehicle details
        v.vehicle_name,
        v.vehicle_type,
        v.capacity as vehicle_capacity,
        v.km_per_day,
        v.price_per_day as vehicle_price_per_day,
        v.available_for as vehicle_available_for,
        -- Hotel details
        h.hotel_name,
        h.location as hotel_location,
        h.price_range as hotel_price_range,
        h.facilities as hotel_facilities
      FROM quotations q
      LEFT JOIN package p ON q.service_type = 'tour' AND q.service_id::text = p.package_id
      LEFT JOIN vehicle v ON q.service_type = 'vehicle' AND q.service_id::text = v.vehicle_id
      LEFT JOIN hotel h ON q.service_type = 'hotel' AND q.service_id::text = h.hotel_id
      WHERE q.quotation_id = $1`,
      [quotationId]
    );

    if (quotationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const quotation = quotationResult.rows[0];

    // Build service details JSON based on service type
    let serviceDetails: any = {};
    if (quotation.service_type === 'tour') {
      serviceDetails = {
        package_name: quotation.package_name,
        description: quotation.package_description,
        highlights: quotation.package_highlights,
        includings: quotation.package_includings,
        duration_days: quotation.duration_days,
        num_adults: quotation.num_adults,
        num_children: quotation.num_children
      };
    } else if (quotation.service_type === 'vehicle') {
      serviceDetails = {
        vehicle_name: quotation.vehicle_name,
        vehicle_type: quotation.vehicle_type,
        capacity: quotation.vehicle_capacity,
        km_per_day: quotation.km_per_day,
        price_per_day: quotation.vehicle_price_per_day,
        available_for: quotation.vehicle_available_for,
        num_adults: quotation.num_adults,
        num_children: quotation.num_children
      };
    } else if (quotation.service_type === 'hotel') {
      serviceDetails = {
        hotel_name: quotation.hotel_name,
        location: quotation.hotel_location,
        price_range: quotation.hotel_price_range,
        facilities: quotation.hotel_facilities,
        num_adults: quotation.num_adults,
        num_children: quotation.num_children
      };
    }

    // Generate invoice number (INV-YYYY-XXXX format)
    const year = new Date().getFullYear();
    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE $1`,
      [`INV-${year}-%`]
    );
    const count = parseInt(countResult.rows[0].count) + 1;
    const invoiceNumber = `INV-${year}-${String(count).padStart(4, '0')}`;

    // Calculate amounts
    const totalAmount = parseFloat(quotation.total_amount || 0);
    const finalDepositPercentage = depositPercentage !== undefined ? parseFloat(depositPercentage) : (quotation.deposit_percentage || 30);
    const depositAmount = (totalAmount * finalDepositPercentage) / 100;
    const remainingAmount = totalAmount - depositAmount;
    const paid = parseFloat(paidAmount);

    // Determine invoice status
    let invoiceStatus = 'paid';
    if (paid < totalAmount && paid >= depositAmount) {
      invoiceStatus = 'partial';
    } else if (paid >= totalAmount) {
      invoiceStatus = 'paid';
    }

    // Insert invoice
    const insertResult = await client.query(
      `INSERT INTO invoices (
        invoice_number, quotation_id, quotation_number,
        customer_name, customer_email, customer_phone, customer_country,
        payment_type, payment_date, payment_reference,
        subtotal, deposit_percentage, deposit_amount, remaining_amount, 
        total_amount, paid_amount,
        service_type, service_id, service_details,
        service_start_date, service_end_date,
        invoice_status, notes, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9,
        $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      ) RETURNING *`,
      [
        invoiceNumber,
        quotationId,
        quotation.quotation_number,
        quotation.customer_name,
        quotation.customer_email,
        quotation.customer_phone,
        quotation.customer_country,
        paymentType,
        paymentReference || null,
        totalAmount,
        finalDepositPercentage,
        depositAmount,
        remainingAmount,
        totalAmount,
        paid,
        quotation.service_type,
        quotation.service_id,
        JSON.stringify(serviceDetails),
        quotation.start_date,
        quotation.end_date,
        invoiceStatus,
        notes || null,
        createdBy || 'admin'
      ]
    );

    const invoice = insertResult.rows[0];

    return res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Full error:', errorMessage);
    return res.status(500).json({ 
      error: 'Failed to create invoice',
      details: errorMessage
    });
  } finally {
    client.release();
  }
}

async function getInvoices(req: NextApiRequest, res: NextApiResponse) {
  const client = await pool.connect();
  
  try {
    const { quotationId, invoiceNumber } = req.query;

    let query = `
      SELECT i.*, q.quotation_number, q.service_type
      FROM invoices i
      LEFT JOIN quotations q ON i.quotation_id = q.quotation_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (quotationId) {
      params.push(quotationId);
      query += ` AND i.quotation_id = $${params.length}`;
    }

    if (invoiceNumber) {
      params.push(invoiceNumber);
      query += ` AND i.invoice_number = $${params.length}`;
    }

    query += ` ORDER BY i.created_at DESC`;

    const result = await client.query(query, params);

    return res.status(200).json({
      invoices: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch invoices',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
}
