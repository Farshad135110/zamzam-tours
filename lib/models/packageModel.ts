import { Prisma } from '@prisma/client';
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
  console.log('updatePackage called with:', { id, payload });
  
  try {
    // Build update fields dynamically to avoid null issues with COALESCE
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (payload.package_name !== undefined) {
      updates.push(`package_name = $${paramIndex++}`);
      values.push(payload.package_name);
    }
    if (payload.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(payload.description);
    }
    if (payload.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(payload.price);
    }
    if (payload.image !== undefined) {
      updates.push(`image = $${paramIndex++}`);
      values.push(payload.image);
    }
    if (payload.highlights !== undefined) {
      updates.push(`highlights = $${paramIndex++}`);
      values.push(payload.highlights);
    }
    if (payload.includings !== undefined) {
      updates.push(`includings = $${paramIndex++}`);
      values.push(payload.includings);
    }
    if (payload.days !== undefined) {
      updates.push(`days = $${paramIndex++}`);
      values.push(payload.days);
    }
    if (payload.itinerary !== undefined) {
      updates.push(`itinerary = $${paramIndex++}`);
      values.push(payload.itinerary);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id); // Add ID as the last parameter
    const query = `
      UPDATE package 
      SET ${updates.join(', ')}
      WHERE package_id = $${paramIndex}
      RETURNING *
    `;

    console.log('SQL query:', query);
    console.log('SQL values:', values);

    const result = await prisma.$queryRawUnsafe<any[]>(query, ...values);
    
    console.log('SQL query result:', result);
    
    if (!result || result.length === 0) {
      throw new Error(`Package with ID ${id} not found or update failed`);
    }
    
    return dbToRecord(result[0]);
  } catch (error: any) {
    console.error('Error in updatePackage:', error);
    throw error;
  }
}

async function getLinkedQuotationCount(id: string): Promise<number> {
  const result = await prisma.$queryRaw<any[]>`
    SELECT COUNT(*)::int AS count FROM quotations WHERE package_id = ${id}
  `;
  return Number(result?.[0]?.count || 0);
}

export async function deletePackage(
  id: string,
  options?: { deleteQuotations?: boolean }
): Promise<void> {
  const deleteQuotations = options?.deleteQuotations ?? false;
  const linkedQuotations = await getLinkedQuotationCount(id);

  if (linkedQuotations > 0 && !deleteQuotations) {
    throw new Error('Package has linked quotations');
  }

  if (linkedQuotations > 0 && deleteQuotations) {
    try {
      await prisma.$executeRaw`
        DELETE FROM quotations WHERE package_id = ${id}
      `;
    } catch (error: any) {
      const message = String(error?.message || '');
      if (message.includes('invoices')) {
        throw new Error('Quotations have invoices and cannot be deleted');
      }
      throw new Error('Failed to delete linked quotations');
    }
  }

  try {
    await prisma.renamedpackage.delete({
      where: { package_id: id }
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error('Package not found');
      }
      if (error.code === 'P2003') {
        throw new Error('Package has linked records and cannot be deleted');
      }
    }
    throw error;
  }
}
