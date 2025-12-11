import { prisma } from '../../src/lib/prisma';

export interface VehicleRecord {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_type: string;
  description: string;
  km_per_day: number;
  price_per_day: number;
  extra_charge_per_km: number;
  image: string;
  capacity: number;
  available_for: string;
}

// Helper to convert DB model to frontend format
function dbToRecord(dbRecord: any): VehicleRecord {
  return {
    vehicle_id: dbRecord.vehicle_id,
    vehicle_name: dbRecord.vehicle_name,
    vehicle_type: dbRecord.vehicle_type,
    description: dbRecord.description || '',
    km_per_day: dbRecord.km_per_day || 0,
    price_per_day: dbRecord.price_per_day || 0,
    extra_charge_per_km: dbRecord.extra_charge_per_km || 0,
    image: dbRecord.image || '',
    capacity: dbRecord.capacity || 0,
    available_for: dbRecord.available_for || ''
  };
}

// Helper to convert frontend format to DB format
function recordToDb(record: Partial<VehicleRecord>) {
  return {
    vehicle_name: record.vehicle_name || '',
    vehicle_type: record.vehicle_type || '',
    description: record.description || '',
    km_per_day: record.km_per_day || 0,
    price_per_day: record.price_per_day || 0,
    extra_charge_per_km: record.extra_charge_per_km || 0,
    image: record.image || '',
    capacity: record.capacity || 0,
    available_for: record.available_for || ''
  };
}

export async function getAllVehicles(): Promise<VehicleRecord[]> {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      vehicle_id: 'asc'
    }
  });
  return vehicles.map(dbToRecord);
}

export async function getVehicleById(id: string): Promise<VehicleRecord | null> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vehicle_id: id }
  });
  return vehicle ? dbToRecord(vehicle) : null;
}

export async function createVehicle(payload: Omit<VehicleRecord, 'vehicle_id'>): Promise<VehicleRecord> {
  // Generate next unique ID
  const lastVehicle = await prisma.vehicle.findMany({
    orderBy: { vehicle_id: 'desc' },
    take: 1
  });
  let nextNum = 1;
  if (lastVehicle.length > 0) {
    const lastId = lastVehicle[0].vehicle_id;
    const match = lastId.match(/V(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }
  const nextId = `V${String(nextNum).padStart(3, '0')}`;

  const dbData = recordToDb(payload);
  const created = await prisma.vehicle.create({
    data: {
      vehicle_id: nextId,
      ...dbData
    }
  });
  return dbToRecord(created);
}

export async function updateVehicle(id: string, payload: Partial<VehicleRecord>): Promise<VehicleRecord> {
  const dbData = recordToDb(payload);
  const updated = await prisma.vehicle.update({
    where: { vehicle_id: id },
    data: dbData
  });
  return dbToRecord(updated);
}

export async function deleteVehicle(id: string): Promise<void> {
  await prisma.vehicle.delete({
    where: { vehicle_id: id }
  });
}
