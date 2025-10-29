import {
  getAllAirportPickups,
  getAirportPickupById,
  createAirportPickup,
  updateAirportPickup,
  deleteAirportPickup,
  AirportPickupRecord
} from '../models/airportPickupModel';

export async function listPickups(): Promise<AirportPickupRecord[]> {
  return getAllAirportPickups();
}

export async function getPickup(id: string): Promise<AirportPickupRecord | null> {
  return getAirportPickupById(id);
}

export async function addPickup(payload: Omit<AirportPickupRecord, 'pickup_id' | 'created_at'>): Promise<AirportPickupRecord> {
  // Basic validation
  if (!payload.pickup_from || !payload.dropoff || !payload.vehicle) {
    throw new Error('pickup_from, dropoff and vehicle are required');
  }
  return createAirportPickup(payload);
}

export async function editPickup(id: string, payload: Partial<AirportPickupRecord>): Promise<AirportPickupRecord | null> {
  return updateAirportPickup(id, payload as Partial<AirportPickupRecord>);
}

export async function removePickup(id: string): Promise<boolean> {
  return deleteAirportPickup(id);
}
