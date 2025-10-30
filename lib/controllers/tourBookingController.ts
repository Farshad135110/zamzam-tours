import {
  getAllTourBookings,
  getTourBookingById,
  createTourBooking,
  updateTourBooking,
  deleteTourBooking,
  TourBookingRecord,
} from '../models/tourBookingModel';

export async function listTourBookings(): Promise<TourBookingRecord[]> {
  return getAllTourBookings();
}

export async function getTourBooking(id: string): Promise<TourBookingRecord | null> {
  return getTourBookingById(id);
}

export async function addTourBooking(payload: Omit<TourBookingRecord, 'tour_booking_id'>): Promise<TourBookingRecord> {
  // Basic validation similar to other controllers
  if (!payload.package_id) throw new Error('package_id is required');
  if (!payload.name) throw new Error('name is required');
  if (!payload.email) throw new Error('email is required');
  if (!payload.phone_no) throw new Error('phone_no is required');
  if (!payload.starting_date) throw new Error('starting_date is required');
  if (!payload.pickup_location) throw new Error('pickup_location is required');
  if (payload.no_of_travellers === undefined || payload.no_of_travellers < 1) {
    throw new Error('no_of_travellers must be at least 1');
  }

  return createTourBooking(payload);
}

export async function editTourBooking(id: string, payload: Partial<TourBookingRecord>): Promise<TourBookingRecord | null> {
  if (payload.no_of_travellers !== undefined && payload.no_of_travellers < 1) {
    throw new Error('no_of_travellers must be at least 1');
  }
  return updateTourBooking(id, payload);
}

export async function removeTourBooking(id: string): Promise<boolean> {
  return deleteTourBooking(id);
}
