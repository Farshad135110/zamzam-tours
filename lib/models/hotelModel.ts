import { prisma } from '../../src/lib/prisma';

// Interface that matches your frontend expectations
export interface HotelRecord {
  hotel_id: string;
  hotel_name: string;
  location: string;
  price_range?: string;
  image?: string;
  facilities?: string;
}

// Helper to convert DB model to frontend format
function dbToRecord(dbRecord: any): HotelRecord {
  return {
    hotel_id: dbRecord.hotel_id,
    hotel_name: dbRecord.hotel_name,
    location: dbRecord.location,
    price_range: dbRecord.price_range || undefined,
    image: dbRecord.image || undefined,
    facilities: dbRecord.facilities || undefined
  };
}

// Generate unique hotel ID (format: HTL0000001, HTL0000002, etc.)
async function generateHotelId(): Promise<string> {
  const lastHotel = await prisma.hotel.findFirst({
    orderBy: {
      hotel_id: 'desc'
    }
  });

  if (!lastHotel) {
    return 'HTL0000001';
  }

  // Extract number from last ID and increment
  const lastNumber = parseInt(lastHotel.hotel_id.replace('HTL', ''), 10);
  const nextNumber = lastNumber + 1;
  return `HTL${nextNumber.toString().padStart(7, '0')}`;
}

export async function getAllHotels(): Promise<HotelRecord[]> {
  const hotels = await prisma.hotel.findMany({
    orderBy: {
      hotel_name: 'asc'
    }
  });
  return hotels.map(dbToRecord);
}

export async function getHotelById(id: string): Promise<HotelRecord | null> {
  const hotel = await prisma.hotel.findUnique({
    where: { hotel_id: id }
  });
  return hotel ? dbToRecord(hotel) : null;
}

export async function createHotel(payload: Omit<HotelRecord, 'hotel_id'>): Promise<HotelRecord> {
  // Generate unique hotel ID
  const hotel_id = await generateHotelId();
  
  const created = await prisma.hotel.create({
    data: {
      hotel_id,
      hotel_name: payload.hotel_name,
      location: payload.location,
      price_range: payload.price_range || null,
      image: payload.image || null,
      facilities: payload.facilities || null
    }
  });
  
  return dbToRecord(created);
}

export async function updateHotel(id: string, payload: Partial<HotelRecord>): Promise<HotelRecord | null> {
  try {
    const updated = await prisma.hotel.update({
      where: { hotel_id: id },
      data: {
        ...(payload.hotel_name && { hotel_name: payload.hotel_name }),
        ...(payload.location && { location: payload.location }),
        ...(payload.price_range !== undefined && { price_range: payload.price_range || null }),
        ...(payload.image !== undefined && { image: payload.image || null }),
        ...(payload.facilities !== undefined && { facilities: payload.facilities || null })
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

export async function deleteHotel(id: string): Promise<boolean> {
  try {
    await prisma.hotel.delete({
      where: { hotel_id: id }
    });
    return true;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return false; // Record not found
    }
    throw error;
  }
}
