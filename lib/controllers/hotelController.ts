import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  HotelRecord
} from '../models/hotelModel';

export async function listHotels(): Promise<HotelRecord[]> {
  return getAllHotels();
}

export async function getHotel(id: string): Promise<HotelRecord | null> {
  return getHotelById(id);
}

export async function addHotel(payload: Omit<HotelRecord, 'hotel_id'>): Promise<HotelRecord> {
  // Basic validation
  if (!payload.hotel_name || !payload.location) {
    throw new Error('hotel_name and location are required');
  }
  return createHotel(payload);
}

export async function editHotel(id: string, payload: Partial<HotelRecord>): Promise<HotelRecord | null> {
  return updateHotel(id, payload);
}

export async function removeHotel(id: string): Promise<boolean> {
  return deleteHotel(id);
}
