import { prisma } from '../../src/lib/prisma';
import { Prisma } from '@prisma/client';

// Interface that matches your frontend expectations
export interface AirportPickupRecord {
  pickup_id: string; // Changed to string to match DB
  pickup_type: 'one_way' | 'two_way';
  pickup_from: string;
  dropoff: string;
  airport?: string;
  passengers: number;
  pickup_time: string; // ISO
  vehicle: string;
  note: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string; // YYYY-MM-DD
}

// Helper to convert DB model to frontend format
function dbToRecord(dbRecord: any): AirportPickupRecord {
  return {
    pickup_id: dbRecord.airportpickup_id,
    pickup_type: dbRecord.type === 'one_way' ? 'one_way' : 'two_way', // Map enum
    pickup_from: dbRecord.pickup_from,
    dropoff: dbRecord.drop_off,
    airport: dbRecord.airport || '',
    passengers: dbRecord.no_of_passengers,
    pickup_time: dbRecord.pickup_time.toISOString(),
    vehicle: dbRecord.vehicle?.vehicle_name || dbRecord.vehicle_id || '',
    note: dbRecord.note || '',
    price: parseFloat(dbRecord.price.toString()),
    status: 'pending', // Default status (not in DB schema)
    created_at: new Date().toISOString().split('T')[0]
  };
}

// Helper to convert frontend format to DB format
function recordToDb(record: Partial<AirportPickupRecord>) {
  return {
    type: record.pickup_type === 'one_way' ? 'one_way' : 'two_way' as any, // Map to enum
    pickup_from: record.pickup_from,
    drop_off: record.dropoff,
    airport: record.airport || '',
    no_of_passengers: record.passengers,
    pickup_time: record.pickup_time ? new Date(record.pickup_time) : new Date(),
    vehicle_id: null, // You can map vehicle name to vehicle_id later
    note: record.note || '',
    price: record.price || 0
  };
}

export async function getAllAirportPickups(): Promise<AirportPickupRecord[]> {
  const pickups = await prisma.airport_pickup.findMany({
    include: {
      vehicle: true
    },
    orderBy: {
      pickup_time: 'desc'
    }
  });
  return pickups.map(dbToRecord);
}

export async function getAirportPickupById(id: string): Promise<AirportPickupRecord | null> {
  const pickup = await prisma.airport_pickup.findUnique({
    where: { airportpickup_id: id },
    include: {
      vehicle: true
    }
  });
  return pickup ? dbToRecord(pickup) : null;
}

export async function createAirportPickup(payload: Omit<AirportPickupRecord, 'pickup_id' | 'created_at'>): Promise<AirportPickupRecord> {
  // Generate next ID
  const count = await prisma.airport_pickup.count();
  const nextId = `AP${String(count + 1).padStart(3, '0')}`;
  
  const dbData = recordToDb(payload);
  
  const created = await prisma.airport_pickup.create({
    data: {
      airportpickup_id: nextId,
      ...dbData
    },
    include: {
      vehicle: true
    }
  });
  
  return dbToRecord(created);
}

export async function updateAirportPickup(id: string, payload: Partial<AirportPickupRecord>): Promise<AirportPickupRecord | null> {
  try {
    const dbData = recordToDb(payload);
    
    const updated = await prisma.airport_pickup.update({
      where: { airportpickup_id: id },
      data: dbData,
      include: {
        vehicle: true
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

export async function deleteAirportPickup(id: string): Promise<boolean> {
  try {
    await prisma.airport_pickup.delete({
      where: { airportpickup_id: id }
    });
    return true;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return false; // Record not found
    }
    throw error;
  }
}
