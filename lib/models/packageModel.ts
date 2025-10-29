import { prisma } from '../../src/lib/prisma';

export interface PackageRecord {
  package_id: string;
  package_name: string;
  description: string;
  price: number | null;
  image: string;
  highlights: string;
  includings: string;
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
    includings: dbRecord.includings || ''
  };
}

// Helper to convert frontend format to DB format
function recordToDb(record: Partial<PackageRecord>) {
  return {
    package_name: record.package_name,
    description: record.description,
    price: record.price,
    image: record.image,
    highlights: record.highlights,
    includings: record.includings
  };
}

export async function getAllPackages(): Promise<PackageRecord[]> {
  const packages = await prisma.renamedpackage.findMany({
    orderBy: {
      package_id: 'asc'
    }
  });
  return packages.map(dbToRecord);
}

export async function getPackageById(id: string): Promise<PackageRecord | null> {
  const pkg = await prisma.renamedpackage.findUnique({
    where: { package_id: id }
  });
  return pkg ? dbToRecord(pkg) : null;
}

export async function createPackage(payload: Omit<PackageRecord, 'package_id'>): Promise<PackageRecord> {
  // Generate next ID
  const count = await prisma.renamedpackage.count();
  const nextId = `P${String(count + 1).padStart(3, '0')}`;
  
  const dbData = recordToDb(payload);
  const created = await prisma.renamedpackage.create({
    data: {
      package_id: nextId,
      ...dbData
    }
  });
  return dbToRecord(created);
}

export async function updatePackage(id: string, payload: Partial<PackageRecord>): Promise<PackageRecord> {
  const dbData = recordToDb(payload);
  const updated = await prisma.renamedpackage.update({
    where: { package_id: id },
    data: dbData
  });
  return dbToRecord(updated);
}

export async function deletePackage(id: string): Promise<void> {
  await prisma.renamedpackage.delete({
    where: { package_id: id }
  });
}
