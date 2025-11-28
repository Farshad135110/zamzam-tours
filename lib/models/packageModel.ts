import { prisma } from '../../src/lib/prisma';

export interface PackageRecord {
  package_id: string;
  package_name: string;
  description: string;
  price: number | null;
  image: string;
  highlights: string;
  includings: string;
  days?: number;
  itinerary?: string;
}

// Helper to convert DB model to frontend format
function dbToRecord(dbRecord: any): PackageRecord {
  return {
    package_id: dbRecord.package_id,
    package_name: dbRecord.package_name,
    description: dbRecord.description || '',
    // Prisma Decimal serializes to string; normalize to number for API consumers
    price: dbRecord.price !== null && dbRecord.price !== undefined ? Number(dbRecord.price) : null,
    image: dbRecord.image || '',
    highlights: dbRecord.highlights || '',
    includings: dbRecord.includings || '',
    days: dbRecord.days || undefined,
    itinerary: dbRecord.itinerary || undefined
  };
}

// Helper to convert frontend format to DB format
function recordToDb(record: Partial<PackageRecord>) {
  return {
    package_name: record.package_name || '',
    description: record.description || '',
    price: record.price ?? null,
    image: record.image || '',
    highlights: record.highlights || '',
    includings: record.includings || '',
    days: record.days ?? null,
    itinerary: record.itinerary ?? null
  };
}

export async function getAllPackages(): Promise<PackageRecord[]> {
  // Use raw SQL to fetch all columns including new ones
  const packages = await prisma.$queryRaw<any[]>`
    SELECT * FROM package ORDER BY package_id ASC
  `;
  return packages.map(dbToRecord);
}

export async function getPackageById(id: string): Promise<PackageRecord | null> {
  const result = await prisma.$queryRaw<any[]>`
    SELECT * FROM package WHERE package_id = ${id}
  `;
  return result.length > 0 ? dbToRecord(result[0]) : null;
}

export async function createPackage(payload: Omit<PackageRecord, 'package_id'>): Promise<PackageRecord> {
  // Generate next ID
  const count = await prisma.renamedpackage.count();
  const nextId = `P${String(count + 1).padStart(3, '0')}`;
  
  // Use raw SQL to insert with new columns
  const result = await prisma.$queryRaw<any[]>`
    INSERT INTO package (package_id, package_name, description, price, image, highlights, includings, days, itinerary)
    VALUES (${nextId}, ${payload.package_name}, ${payload.description}, ${payload.price}, 
            ${payload.image || ''}, ${payload.highlights || ''}, ${payload.includings || ''}, 
            ${payload.days || null}, ${payload.itinerary || null})
    RETURNING *
  `;
  
  return dbToRecord(result[0]);
}

export async function updatePackage(id: string, payload: Partial<PackageRecord>): Promise<PackageRecord> {
  // Use raw SQL to update with new columns
  const result = await prisma.$queryRaw<any[]>`
    UPDATE package 
    SET package_name = COALESCE(${payload.package_name}, package_name),
        description = COALESCE(${payload.description}, description),
        price = ${payload.price !== undefined ? payload.price : null},
        image = COALESCE(${payload.image}, image),
        highlights = COALESCE(${payload.highlights}, highlights),
        includings = COALESCE(${payload.includings}, includings),
        days = ${payload.days !== undefined ? payload.days : null},
        itinerary = ${payload.itinerary !== undefined ? payload.itinerary : null}
    WHERE package_id = ${id}
    RETURNING *
  `;
  
  return dbToRecord(result[0]);
}

export async function deletePackage(id: string): Promise<void> {
  await prisma.renamedpackage.delete({
    where: { package_id: id }
  });
}
