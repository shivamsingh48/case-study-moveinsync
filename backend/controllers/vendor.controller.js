import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asynchandler.js'
import vendorHierarchy from '../services/vendorHierarchy.js'

export const createVendor=asyncHandler(async(req,res)=>{
     const parentVendor = req.vendor;     
     const {name,email,password,role}=req.body

     if(!name || !email || !password || !role){
        throw new ApiError(400,"All fields are required")
     }

     const vendorData = {
         name,email,password,role
     };

    const vendor = await vendorHierarchy.createSubVendor(
        parentVendor,
        vendorData
      );

      if(!vendor){
        throw new ApiError(400, "Error encounterd while creating vendor");
      }
      
      res.status(201).json({
        status: 'success',
        vendor:{
          email,
          name,
          role
        },
        message:"Successfully creating vendor"
      })
})