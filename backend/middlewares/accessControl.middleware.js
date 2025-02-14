import { Vendor } from "../models/vendor.model.js";
import { ApiError } from "../utils/ApiError.js";

const checkPermissions = (requiredPermission) => {
    return async (req, res, next) => {
      try {
        const vendor = await Vendor.findById(req.vendor.id)
          .select('+permissions +delegatedPermissions');
  
        const hasAccess = vendor.permissions.includes('*') ||
        vendor.permissions.includes(requiredPermission) ||
        vendor.delegatedPermissions.some(dp => 
          dp.permission === requiredPermission
        );
  
        if (!hasAccess) {
          return next(new ApiError(403, 'Insufficient permissions'));
        }
  
        next();
      } catch (err) {
        next(new ApiError(500, 'Permission check failed'));
      }
    };
};
  
export {checkPermissions}