import {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  PackageRecord
} from '../models/packageModel';

export class PackageController {
  static async getAll(): Promise<PackageRecord[]> {
    return await getAllPackages();
  }

  static async getById(id: string): Promise<PackageRecord | null> {
    if (!id) {
      throw new Error('Package ID is required');
    }
    return await getPackageById(id);
  }

  static async create(data: Omit<PackageRecord, 'package_id'>): Promise<PackageRecord> {
    // Validate required fields
    if (!data.package_name) {
      throw new Error('Package name is required');
    }
    if (!data.description) {
      throw new Error('Description is required');
    }

    return await createPackage(data);
  }

  static async update(id: string, data: Partial<PackageRecord>): Promise<PackageRecord> {
    if (!id) {
      throw new Error('Package ID is required');
    }

    const existing = await getPackageById(id);
    if (!existing) {
      throw new Error('Package not found');
    }

    return await updatePackage(id, data);
  }

  static async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Package ID is required');
    }

    const existing = await getPackageById(id);
    if (!existing) {
      throw new Error('Package not found');
    }

    await deletePackage(id);
  }
}
