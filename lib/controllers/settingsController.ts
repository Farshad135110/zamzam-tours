import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsController {
  static async getAll() {
    try {
      const settings = await prisma.$queryRaw<any[]>`
        SELECT setting_key, setting_value, setting_type, description
        FROM site_settings
        ORDER BY setting_key
      `;
      
      // Convert to key-value object
      const settingsObj: Record<string, any> = {};
      settings.forEach(setting => {
        const value = setting.setting_value;
        
        // Parse value based on type
        if (setting.setting_type === 'boolean') {
          settingsObj[setting.setting_key] = value === 'true' || value === true;
        } else if (setting.setting_type === 'number') {
          settingsObj[setting.setting_key] = parseFloat(value);
        } else {
          settingsObj[setting.setting_key] = value;
        }
      });
      
      return settingsObj;
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      
      // If table doesn't exist, return default settings
      if (error.message?.includes('relation "site_settings" does not exist')) {
        return this.getDefaultSettings();
      }
      
      throw new Error(`Failed to fetch settings: ${error.message}`);
    }
  }

  static getDefaultSettings() {
    return {
      // General Settings
      siteTitle: 'ZamZam Lanka Tours',
      contactEmail: 'info@zamzamlankatours.com',
      phoneNumber: '+94 XX XXX XXXX',
      whatsappNumber: '+94 XX XXX XXXX',
      address: '123 Galle Road, Colombo, Sri Lanka',
      currency: 'LKR',
      timezone: 'Asia/Colombo',
      
      // Business Settings
      companyName: 'ZamZam Lanka Tours',
      tagline: 'Discover Sri Lanka with Expert Local Guidance',
      description: 'Premium tour operator in Sri Lanka',
      website: 'https://zamzamlankatours.com',
      taxRate: 0,
      bookingConfirmation: true,
      autoApproveBookings: false,
      
      // Social Media
      facebook: 'https://facebook.com/zamzamlankatours',
      instagram: 'https://instagram.com/zamzamlankatours',
      
      // Notification Settings
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: true,
      bookingAlerts: true,
      paymentAlerts: true,
      
      // Security Settings
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      
      // Payment Settings
      paymentGateway: 'bank',
      testMode: false,
      currencySymbol: 'Rs.'
    };
  }

  static async update(settings: Record<string, any>) {
    try {
      // First, try to create the table if it doesn't exist
      await this.ensureTableExists();

      for (const [key, value] of Object.entries(settings)) {
        const settingType = typeof value === 'boolean' ? 'boolean' 
                          : typeof value === 'number' ? 'number' 
                          : 'string';
        
        const settingValue = String(value);

        // Upsert setting
        await prisma.$executeRaw`
          INSERT INTO site_settings (setting_key, setting_value, setting_type, updated_at)
          VALUES (${key}, ${settingValue}, ${settingType}, CURRENT_TIMESTAMP)
          ON CONFLICT (setting_key)
          DO UPDATE SET 
            setting_value = ${settingValue},
            setting_type = ${settingType},
            updated_at = CURRENT_TIMESTAMP
        `;
      }

      return await this.getAll();
    } catch (error: any) {
      console.error('Error updating settings:', error);
      throw new Error(`Failed to update settings: ${error.message}`);
    }
  }

  static async ensureTableExists() {
    try {
      // Check if table exists
      const tableExists = await prisma.$queryRaw<any[]>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'site_settings'
        );
      `;

      if (!tableExists[0]?.exists) {
        // Create table if it doesn't exist
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS site_settings (
            setting_id SERIAL PRIMARY KEY,
            setting_key VARCHAR(100) UNIQUE NOT NULL,
            setting_value TEXT,
            setting_type VARCHAR(20) DEFAULT 'string',
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        
        // Insert default settings
        const defaults = this.getDefaultSettings();
        for (const [key, value] of Object.entries(defaults)) {
          const settingType = typeof value === 'boolean' ? 'boolean' 
                            : typeof value === 'number' ? 'number' 
                            : 'string';
          const settingValue = String(value);
          
          await prisma.$executeRaw`
            INSERT INTO site_settings (setting_key, setting_value, setting_type)
            VALUES (${key}, ${settingValue}, ${settingType})
            ON CONFLICT (setting_key) DO NOTHING
          `;
        }
      }
    } catch (error: any) {
      console.error('Error ensuring table exists:', error);
      // Don't throw - let it continue with default settings
    }
  }
}
