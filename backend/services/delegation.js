import { Vendor } from "../models/vendor.model.js";

class DelegationService {
    async delegatePermissions(superVendorId, subVendorId, permissions) {
      const superVendor = await Vendor.findById(superVendorId);
      const subVendor = await Vendor.findById(subVendorId);
  
      // Validate hierarchy
      if (!subVendor.parent.equals(superVendor._id)) {
        throw new Error('Sub-vendor not under Super Vendor');
      }
  
      // Add delegated permissions
      subVendor.delegatedPermissions = subVendor.delegatedPermissions.concat(
        permissions.map(permission => ({
          permission,
          delegatedBy: superVendorId
        }))
      );
  
      await subVendor.save();
      return subVendor;
    }
  
    async revokePermissions(superVendorId, subVendorId, permissions) {
      const subVendor = await Vendor.findById(subVendorId);
  
      // Revoke specific permissions
      subVendor.delegatedPermissions = subVendor.delegatedPermissions.filter(
        dp => !permissions.includes(dp.permission) || 
              !dp.delegatedBy.equals(superVendorId)
      );
  
      await subVendor.save();
      return subVendor;
    }
  }
  
  export default new DelegationService();