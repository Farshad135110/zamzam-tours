import { prisma } from '../../src/lib/prisma';

export interface TourBookingRecord {
  tour_booking_id: string;
  package_id: string;
  name: string;
  email: string;
  phone_no: string;
  no_of_travellers: number;
  starting_date: string; // ISO date string (YYYY-MM-DD)
  pickup_location: string;
  special_requirements?: string;
}

// Convert DB model to API record
function dbToRecord(db: any): TourBookingRecord {
  return {
    tour_booking_id: db.tour_booking_id,
    package_id: db.package_id,
    name: db.name,
    email: db.email,
    phone_no: db.phone_no,
    no_of_travellers: db.no_of_travellers,
    starting_date: db.starting_date instanceof Date
      ? db.starting_date.toISOString().split('T')[0]
      : db.starting_date,
    pickup_location: db.pickup_location,
    special_requirements: db.special_requirements || ''
  };
}

// Convert API record to DB data
function recordToDb(record: Partial<TourBookingRecord>) {
  return {
    package_id: record.package_id,
    name: record.name,
    email: record.email,
    phone_no: record.phone_no,
    no_of_travellers: record.no_of_travellers,
    starting_date: record.starting_date ? new Date(record.starting_date) : undefined,
    pickup_location: record.pickup_location,
    special_requirements: record.special_requirements ?? null
  };
}

export async function getAllTourBookings(): Promise<TourBookingRecord[]> {
  const rows = await prisma.tour_booking.findMany({
    orderBy: { starting_date: 'desc' }
  });
  return rows.map(dbToRecord);
}

export async function getTourBookingById(id: string): Promise<TourBookingRecord | null> {
  const row = await prisma.tour_booking.findUnique({
    where: { tour_booking_id: id }
  });
  return row ? dbToRecord(row) : null;
}

export async function createTourBooking(payload: Omit<TourBookingRecord, 'tour_booking_id'>): Promise<TourBookingRecord> {
  // Generate next ID with TB prefix
  const count = await prisma.tour_booking.count();
  const nextId = `TB${String(count + 1).padStart(3, '0')}`;

  const dbData = recordToDb(payload);
  const created = await prisma.tour_booking.create({
    data: {
      tour_booking_id: nextId,
      ...dbData
    }
  });
  return dbToRecord(created);
}

export async function updateTourBooking(id: string, payload: Partial<TourBookingRecord>): Promise<TourBookingRecord | null> {
  try {
    const dbData = recordToDb(payload);
    const updated = await prisma.tour_booking.update({
      where: { tour_booking_id: id },
      data: dbData
    });
    return dbToRecord(updated);
  } catch (error: any) {
    if (error?.code === 'P2025') return null; // not found
    throw error;
  }
}

export async function deleteTourBooking(id: string): Promise<boolean> {
  try {
    await prisma.tour_booking.delete({ where: { tour_booking_id: id } });
    return true;
  } catch (error: any) {
    if (error?.code === 'P2025') return false; // not found
    throw error;
  }
}
