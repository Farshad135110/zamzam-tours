import {
  getAllHotelBookings,
  getHotelBookingById,
  createHotelBooking,
  updateHotelBooking,
  deleteHotelBooking,
  HotelBookingRecord
} from '../models/hotelBookingModel';

export async function listHotelBookings(): Promise<HotelBookingRecord[]> {
  return getAllHotelBookings();
}

export async function getHotelBooking(id: string): Promise<HotelBookingRecord | null> {
  return getHotelBookingById(id);
}

export async function addHotelBooking(payload: Omit<HotelBookingRecord, 'hotel_booking_id' | 'no_of_dates' | 'hotel_name'>): Promise<HotelBookingRecord> {
  // Basic validation
  if (!payload.name || !payload.email || !payload.phone_no) {
    throw new Error('name, email, and phone_no are required');
  }
  if (!payload.check_in || !payload.check_out) {
    throw new Error('check_in and check_out dates are required');
  }
  if (new Date(payload.check_out) <= new Date(payload.check_in)) {
    throw new Error('check_out must be after check_in');
  }
  if (payload.no_of_rooms < 1) {
    throw new Error('no_of_rooms must be at least 1');
  }
  if (payload.no_of_people < 1) {
    throw new Error('no_of_people must be at least 1');
  }
  return createHotelBooking(payload);
}

export async function editHotelBooking(id: string, payload: Partial<HotelBookingRecord>): Promise<HotelBookingRecord | null> {
  if (payload.check_in && payload.check_out && new Date(payload.check_out) <= new Date(payload.check_in)) {
    throw new Error('check_out must be after check_in');
  }
  if (payload.no_of_rooms !== undefined && payload.no_of_rooms < 1) {
    throw new Error('no_of_rooms must be at least 1');
  }
  if (payload.no_of_people !== undefined && payload.no_of_people < 1) {
    throw new Error('no_of_people must be at least 1');
  }
  return updateHotelBooking(id, payload);
}

export async function removeHotelBooking(id: string): Promise<boolean> {
  return deleteHotelBooking(id);
}
