import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  VehicleRecord
} from '../models/vehicleModel';

export class VehicleController {
  static async getAll(): Promise<VehicleRecord[]> {
    return await getAllVehicles();
  }

  static async getById(id: string): Promise<VehicleRecord | null> {
    if (!id) {
      throw new Error('Vehicle ID is required');
    }
    return await getVehicleById(id);
  }

  static async create(data: Omit<VehicleRecord, 'vehicle_id'>): Promise<VehicleRecord> {
    // Validate required fields
    if (!data.vehicle_name || !data.vehicle_type) {
      throw new Error('Vehicle name and type are required');
    }
    if (!data.capacity || data.capacity < 1) {
      throw new Error('Valid capacity is required');
    }
    if (!data.km_per_day || data.km_per_day < 1) {
      throw new Error('Valid km per day is required');
    }
    if (!data.price_per_day || data.price_per_day < 0) {
      throw new Error('Valid price per day is required');
    }

    return await createVehicle(data);
  }

  static async update(id: string, data: Partial<VehicleRecord>): Promise<VehicleRecord> {
    if (!id) {
      throw new Error('Vehicle ID is required');
    }

    const existing = await getVehicleById(id);
    if (!existing) {
      throw new Error('Vehicle not found');
    }

    // Validate if capacity is being updated
    if (data.capacity !== undefined && data.capacity < 1) {
      throw new Error('Valid capacity is required');
    }

    // Validate if km_per_day is being updated
    if (data.km_per_day !== undefined && data.km_per_day < 1) {
      throw new Error('Valid km per day is required');
    }

    // Validate if price_per_day is being updated
    if (data.price_per_day !== undefined && data.price_per_day < 0) {
      throw new Error('Valid price per day is required');
    }

    return await updateVehicle(id, data);
  }

  static async delete(id: string): Promise<void> {
    if (!id) {
      throw new Error('Vehicle ID is required');
    }

    const existing = await getVehicleById(id);
    if (!existing) {
      throw new Error('Vehicle not found');
    }

    await deleteVehicle(id);
  }
}
