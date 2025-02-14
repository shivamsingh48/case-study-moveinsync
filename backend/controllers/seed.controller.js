import { Vendor } from "../models/vendor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const createSuperVendor = asyncHandler(async (req, res) => {
    // Manual validation for first Super Vendor
    const exists = await Vendor.exists({ role: 'SUPER' });
    if (exists) throw new ApiError(400, 'Super vendor already exists');
  
    const superVendor = await Vendor.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'SUPER',
      parent: null // Explicitly no parent
    });
  
    res.status(201).json(
      {
        success:true,
        superVendor: {
          _id: superVendor._id,
          name: superVendor.name,
          email: superVendor.email,
          role: superVendor.role
        },
        message:"successfully created super vendor"
      }
    );
});