import { NextApiRequest, NextApiResponse } from 'next';
import { PackageController } from '../../../lib/controllers/packageController';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';
import { logServerAction, logServerError } from '../../../src/lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Package ID is required' });
  }

  try {
    // GET is public (for website display)
    if (req.method === 'GET') {
      logServerAction('PACKAGE_API', 'GET /api/packages/:id', { packageId: id });
      const pkg = await PackageController.getById(id);
      if (!pkg) {
        logServerError('PACKAGE_API', 'Package not found for GET', 'Not found', { packageId: id });
        return res.status(404).json({ error: 'Package not found' });
      }
      return res.status(200).json(pkg);
    }

    // PUT and DELETE require authentication
    if (req.method === 'PUT') {
      return authMiddleware(async (authReq: AuthRequest) => {
        logServerAction('PACKAGE_API', 'PUT /api/packages/:id', {
          packageId: id,
          userId: authReq.user?.id,
          bodyKeys: Object.keys(authReq.body)
        });
        
        try {
          const pkg = await PackageController.update(id, authReq.body);
          logServerAction('PACKAGE_API', 'Package updated successfully', {
            packageId: id,
            packageName: pkg?.package_name
          });
          return res.status(200).json({ success: true, package: pkg });
        } catch (error: any) {
          logServerError('PACKAGE_API', 'Error updating package', error, {
            packageId: id,
            userId: authReq.user?.id
          });
          return res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to update package' 
          });
        }
      })(req, res);
    }

    if (req.method === 'DELETE') {
      return authMiddleware(async (authReq: AuthRequest) => {
        logServerAction('PACKAGE_API', 'DELETE /api/packages/:id', {
          packageId: id,
          userId: authReq.user?.id
        });
        try {
          const force = req.query.force === 'true';
          await PackageController.delete(id, { deleteQuotations: force });
          return res.status(204).end();
        } catch (error: any) {
          const message = error?.message || 'Failed to delete package';
          const status = message.includes('linked quotations') || message.includes('linked records') ? 409
            : message.includes('not found') ? 404
            : message.includes('invoices') ? 409
            : 500;
          const code = message.includes('linked quotations') ? 'HAS_QUOTATIONS'
            : message.includes('invoices') ? 'HAS_INVOICES'
            : undefined;
          logServerError('PACKAGE_API', 'Error deleting package', error, {
            packageId: id,
            userId: authReq.user?.id
          });
          return res.status(status).json({ error: message, code });
        }
      })(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    logServerError('PACKAGE_API', 'Error in package API handler', error, { packageId: id });
    
    if (error.message === 'Package not found') {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(error.message.includes('required') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
