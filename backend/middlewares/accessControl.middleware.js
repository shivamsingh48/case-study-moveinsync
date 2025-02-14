import { Vendor } from "../models/vendor.model.js";

const checkPermissions = (requiredPermission) => {
    return async (req, res, next) => {
      try {
        const vendor = await Vendor.findById(req.vendor.id)
          .select('+permissions +delegatedPermissions');
  
        const hasAccess = vendor.permissions.includes('*') ||
        vendor.permissions.includes(requiredPermission) ||
        vendor.delegatedPermissions.includes(requiredPermission);
  
        if (!hasAccess) {
          return next(new ApiError(403, 'Insufficient permissions'));
        }
  
        next();
      } catch (err) {
        next(new ApiError(500, 'Permission check failed'));
      }
    };
};
  
export default {checkPermissions}