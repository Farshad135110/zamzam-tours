import { prisma } from '../../src/lib/prisma';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export interface VehicleImage {
  image_id?: number;
  vehicle_id?: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface VehicleRecord {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_type: string;
  description: string;
  km_per_day: number;
  price_per_day: number;
  extra_charge_per_km: number;
  image: string;
  images?: VehicleImage[];
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
  
  // Fetch images for all vehicles
  const vehicleIds = vehicles.map(v => v.vehicle_id);
  let imagesMap: { [key: string]: VehicleImage[] } = {};
  
  if (vehicleIds.length > 0) {
    try {
      const imagesQuery = `
        SELECT * FROM vehicle_images 
        WHERE vehicle_id = ANY($1)
        ORDER BY is_primary DESC, display_order ASC
      `;
      const imagesResult = await pool.query(imagesQuery, [vehicleIds]);
      
      // Group images by vehicle_id
      imagesResult.rows.forEach((img: any) => {
        if (!imagesMap[img.vehicle_id]) {
          imagesMap[img.vehicle_id] = [];
        }
        imagesMap[img.vehicle_id].push({
          image_id: img.image_id,
          vehicle_id: img.vehicle_id,
          image_url: img.image_url,
          is_primary: img.is_primary,
          display_order: img.display_order
        });
      });
    } catch (error) {
      console.error('Error fetching vehicle images:', error);
    }
  }
  
  return vehicles.map(v => ({
    ...dbToRecord(v),
    images: imagesMap[v.vehicle_id] || []
  }));
}

export async function getVehicleById(id: string): Promise<VehicleRecord | null> {
  const vehicle = await prisma.vehicle.findUnique({
    where: { vehicle_id: id }
  });
  
  if (!vehicle) return null;
  
  // Fetch images for this vehicle
  let images: VehicleImage[] = [];
  try {
    const imagesQuery = `
      SELECT * FROM vehicle_images 
      WHERE vehicle_id = $1
      ORDER BY is_primary DESC, display_order ASC
    `;
    const imagesResult = await pool.query(imagesQuery, [id]);
    images = imagesResult.rows.map((img: any) => ({
      image_id: img.image_id,
      vehicle_id: img.vehicle_id,
      image_url: img.image_url,
      is_primary: img.is_primary,
      display_order: img.display_order
    }));
  } catch (error) {
    console.error('Error fetching vehicle images:', error);
  }
  
  return {
    ...dbToRecord(vehicle),
    images
  };
}

export async function createVehicle(payload: Omit<VehicleRecord, 'vehicle_id'>): Promise<VehicleRecord> {
  // Generate next unique ID by finding all vehicles and getting the max number
  const allVehicles = await prisma.vehicle.findMany({
    select: { vehicle_id: true }
  });
  
  let nextNum = 1;
  if (allVehicles.length > 0) {
    const nums = allVehicles
      .map(v => {
        const match = v.vehicle_id.match(/V(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => n > 0);
    
    if (nums.length > 0) {
      nextNum = Math.max(...nums) + 1;
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
