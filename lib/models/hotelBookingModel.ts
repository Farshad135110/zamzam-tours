import { prisma } from '../../src/lib/prisma';

// Interface that matches your frontend expectations
export interface HotelBookingRecord {
  hotel_booking_id: string;
  hotel_id: string;
  name: string;
  email: string;
  phone_no: string;
  check_in: string; // ISO date string
  check_out: string; // ISO date string
  no_of_dates: number;
  no_of_rooms: number;
  no_of_people: number;
  hotel_name?: string; // From joined hotel table
}

// Helper to convert DB model to frontend format
function dbToRecord(dbRecord: any): HotelBookingRecord {
  return {
    hotel_booking_id: dbRecord.hotel_booking_id,
    hotel_id: dbRecord.hotel_id || '',
    name: dbRecord.name || '',
    email: dbRecord.email || '',
    phone_no: dbRecord.phone_no,
    check_in: dbRecord.check_in.toISOString().split('T')[0],
    check_out: dbRecord.check_out.toISOString().split('T')[0],
    no_of_dates: dbRecord.no_of_dates || 1,
    no_of_rooms: dbRecord.no_of_rooms,
    no_of_people: dbRecord.no_of_people,
    hotel_name: dbRecord.hotel?.hotel_name
  };
}

// Helper to convert frontend format to DB format
function recordToDb(record: Partial<HotelBookingRecord>) {
  return {
    hotel_id: record.hotel_id || null,
    name: record.name || '',
    email: record.email || '',
    phone_no: record.phone_no,
    check_in: record.check_in ? new Date(record.check_in) : new Date(),
    check_out: record.check_out ? new Date(record.check_out) : new Date(),
    no_of_rooms: record.no_of_rooms || 1,
    no_of_people: record.no_of_people || 1
  };
}

export async function getAllHotelBookings(): Promise<HotelBookingRecord[]> {
  const bookings = await prisma.hotel_booking.findMany({
    include: {
      hotel: true
    },
    orderBy: {
      check_in: 'desc'
    }
  });
  return bookings.map(dbToRecord);
}

export async function getHotelBookingById(id: string): Promise<HotelBookingRecord | null> {
  const booking = await prisma.hotel_booking.findUnique({
    where: { hotel_booking_id: id },
    include: {
      hotel: true
    }
  });
  return booking ? dbToRecord(booking) : null;
}

export async function createHotelBooking(payload: Omit<HotelBookingRecord, 'hotel_booking_id' | 'no_of_dates' | 'hotel_name'>): Promise<HotelBookingRecord> {
  // Generate next ID
  const count = await prisma.hotel_booking.count();
  const nextId = `HB${String(count + 1).padStart(3, '0')}`;
  
  const dbData = recordToDb(payload);
  
  const created = await prisma.hotel_booking.create({
    data: {
      hotel_booking_id: nextId,
      ...dbData
    },
    include: {
      hotel: true
    }
  });
  
  return dbToRecord(created);
}

export async function updateHotelBooking(id: string, payload: Partial<HotelBookingRecord>): Promise<HotelBookingRecord | null> {
  try {
    const dbData = recordToDb(payload);
    
    const updated = await prisma.hotel_booking.update({
      where: { hotel_booking_id: id },
      data: dbData,
      include: {
        hotel: true
      }
    });
    
    return dbToRecord(updated);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
}

export async function deleteHotelBooking(id: string): Promise<boolean> {
  try {
    await prisma.hotel_booking.delete({
      where: { hotel_booking_id: id }
    });
    return true;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return false; // Record not found
    }
    throw error;
  }
}
