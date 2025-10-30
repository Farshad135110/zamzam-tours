import { prisma } from '../../src/lib/prisma';

export interface VehicleBookingRecord {
  vehicle_booking_id: string;
  rental_type: string; // self_drive | with_driver | tour
  customer_type: string;
  name: string;
  email: string;
  phone_no: string;
  pickup_location: string;
  pickup_date: string; // ISO yyyy-mm-dd
  return_date: string; // ISO yyyy-mm-dd
  no_of_days: number; // maps to DB no_of_dates
  special_request?: string;
  vehicle_id: string | null;
}

function dbToRecord(db: any): VehicleBookingRecord {
  return {
    vehicle_booking_id: db.vehicle_booking_id,
    rental_type: db.rental_type,
    customer_type: db.customer_type,
    name: db.name,
    email: db.email,
    phone_no: db.phone_no,
    pickup_location: db.pickup_location,
    pickup_date: db.pickup_date instanceof Date ? db.pickup_date.toISOString().split('T')[0] : db.pickup_date,
    return_date: db.return_date instanceof Date ? db.return_date.toISOString().split('T')[0] : db.return_date,
    no_of_days: db.no_of_dates ?? 1,
    special_request: db.special_request || '',
    vehicle_id: db.vehicle_id || null
  };
}

function recordToDb(record: Partial<VehicleBookingRecord>) {
  return {
    rental_type: record.rental_type || 'self_drive',
    customer_type: record.customer_type || 'foreign',
    name: record.name || '',
    email: record.email || '',
    phone_no: record.phone_no || '',
    pickup_location: record.pickup_location || '',
    pickup_date: record.pickup_date ? new Date(record.pickup_date) : new Date(),
    return_date: record.return_date ? new Date(record.return_date) : new Date(),
    no_of_dates: record.no_of_days || 1,
    special_request: record.special_request ?? null,
    vehicle_id: record.vehicle_id ?? null
  };
}

export async function getAllVehicleBookings(): Promise<VehicleBookingRecord[]> {
  const rows = await prisma.vehicle_booking.findMany({
    orderBy: { pickup_date: 'desc' }
  });
  return rows.map(dbToRecord);
}

export async function getVehicleBookingById(id: string): Promise<VehicleBookingRecord | null> {
  const row = await prisma.vehicle_booking.findUnique({ where: { vehicle_booking_id: id } });
  return row ? dbToRecord(row) : null;
}

export async function createVehicleBooking(payload: Omit<VehicleBookingRecord, 'vehicle_booking_id'>): Promise<VehicleBookingRecord> {
  const count = await prisma.vehicle_booking.count();
  const nextId = `VB${String(count + 1).padStart(3, '0')}`;
  const dbData = recordToDb(payload);
  const created = await prisma.vehicle_booking.create({
    data: {
      vehicle_booking_id: nextId,
      ...dbData
    }
  });
  return dbToRecord(created);
}

export async function updateVehicleBooking(id: string, payload: Partial<VehicleBookingRecord>): Promise<VehicleBookingRecord | null> {
  try {
    const dbData = recordToDb(payload);
    const updated = await prisma.vehicle_booking.update({
      where: { vehicle_booking_id: id },
      data: dbData
    });
    return dbToRecord(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') return null;
    throw error;
  }
}

export async function deleteVehicleBooking(id: string): Promise<boolean> {
  try {
    await prisma.vehicle_booking.delete({ where: { vehicle_booking_id: id } });
    return true;
  } catch (error: any) {
    if (error?.code === 'P2025') return false;
    throw error;
  }
}
