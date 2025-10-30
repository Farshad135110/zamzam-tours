import {
  getAllVehicleBookings,
  getVehicleBookingById,
  createVehicleBooking,
  updateVehicleBooking,
  deleteVehicleBooking,
  VehicleBookingRecord,
} from '../models/vehicleBookingModel';

export async function listVehicleBookings(): Promise<VehicleBookingRecord[]> {
  return getAllVehicleBookings();
}

export async function getVehicleBooking(id: string): Promise<VehicleBookingRecord | null> {
  return getVehicleBookingById(id);
}

export async function addVehicleBooking(payload: Omit<VehicleBookingRecord, 'vehicle_booking_id'>): Promise<VehicleBookingRecord> {
  // Basic validation according to schema
  if (!payload.name) throw new Error('name is required');
  if (!payload.email) throw new Error('email is required');
  if (!payload.phone_no) throw new Error('phone_no is required');
  if (!payload.rental_type) throw new Error('rental_type is required');
  if (!payload.customer_type) throw new Error('customer_type is required');
  if (!payload.pickup_location) throw new Error('pickup_location is required');
  if (!payload.pickup_date) throw new Error('pickup_date is required');
  if (!payload.return_date) throw new Error('return_date is required');
  if (payload.no_of_days === undefined || payload.no_of_days < 1) throw new Error('no_of_days must be at least 1');

  return createVehicleBooking(payload);
}

export async function editVehicleBooking(id: string, payload: Partial<VehicleBookingRecord>): Promise<VehicleBookingRecord | null> {
  if (payload.no_of_days !== undefined && payload.no_of_days < 1) {
    throw new Error('no_of_days must be at least 1');
  }
  return updateVehicleBooking(id, payload);
}

export async function removeVehicleBooking(id: string): Promise<boolean> {
  return deleteVehicleBooking(id);
}
