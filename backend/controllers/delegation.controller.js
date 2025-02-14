import DelegationService from '../services/delegation.js';
import {asyncHandler} from '../utils/asynchandler.js'
import {ApiError} from '../utils/ApiError.js'

export const delegate = asyncHandler(async (req,res)=>{
    const { subVendorId, permissions } = req.body;

    if(!subVendorId || !permissions) throw new ApiError(400,"All fields are required")

    const superVendorId = req.vendor._id;

    const subVendor = await DelegationService.delegatePermissions(
      superVendorId,
      subVendorId,
      permissions
    );

    if(!subVendor) throw new ApiError(500,"Internal server error")

    res.status(200).json({success:true,subVendor});
})

export const revoke = asyncHandler(async(req,res)=>{
    const { subVendorId, permissions } = req.body;

    if(!subVendorId || !permissions) throw new ApiError(400,"All fields are required")

    const superVendorId = req.vendor._id;

    const subVendor = await DelegationService.revokePermissions(
      superVendorId,
      subVendorId,
      permissions
    );

    if(!subVendor) throw new ApiError(500,"Internal server error")

    res.status(200).json({success:true,subVendor});
})