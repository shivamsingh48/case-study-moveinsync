import { asyncHandler } from '../utils/asynchandler.js';
import { Vendor } from '../models/vendor.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Driver } from '../models/driver.model.js';
import {ApiError} from '../utils/ApiError.js'

// ------SUPER VENDOR DASHBOARD ------- // 

export const getDashboardData = asyncHandler(async (req, res) => {
  const superVendor = req.vendor;

  if (superVendor.role !== 'SUPER') {
   throw new ApiError(400,'Access denied: Only Super Vendors can view this data.');
  }

  // Use aggregation to fetch all descendant vendors recursively.
  const result = await Vendor.aggregate([
    { $match: { _id: superVendor._id } },
    {
      $graphLookup: {
        from: 'vendors',            // The collection name for vendors. 
        startWith: '$_id',          // Begin with the Super Vendor's _id
        connectFromField: '_id',    // Link from the parent's _id
        connectToField: 'parent',   // to the child's 'parent' field
        as: 'descendants'           // Store the results in a field called 'descendants'
      }
    }
  ]);

  // 'descendants' will include all vendors under the Super Vendor.
  let descendantVendors = [];
  if (result.length > 0) {
    descendantVendors = result[0].descendants;
  }

  // Create an array of vendor IDs that includes the super vendor and all its descendants.
  const vendorIds = [superVendor._id, ...descendantVendors.map(vendor => vendor._id)];

  // Now you can use these vendorIds to aggregate fleet and driver data.
  const vehicles = await Vehicle.find({ vendor: { $in: vendorIds } });
  const drivers = await Driver.find({ vendor: { $in: vendorIds } });

  const activeVehiclesCount = vehicles.filter(vehicle => vehicle.status === 'ACTIVE').length;
  const inactiveVehiclesCount = vehicles.filter(vehicle => vehicle.status === 'INACTIVE').length;
  const pendingVerifications = vehicles.filter(vehicle =>
        vehicle.documents.some(doc => doc.verified === false)
        ).length;
  const availableDriversCount = drivers.filter(driver => driver.status === 'AVAILABLE').length;

  res.status(200).json({
    success:true,
    dashboard:{
        superVendor,
        allVendors: descendantVendors, 
        fleetStatus: {
        activeVehiclesCount,
        inactiveVehiclesCount,
        pendingVerifications
        },
        driverStatus: {
        availableDriversCount
        }
    },
    message:"Fetched dashboard successfully"
  });
});



// --------OVERRIDE OPERATIONS --------- //

export const overrideVehicleOperation = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;
    const superVendor = req.vendor;
  
    if (superVendor.role !== 'SUPER') {
        throw new ApiError(403,"Access Denied")
    }
  
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
        throw new ApiError(404,"vehicle not found")
    }
  
    // For example, disable the vehicle operation by setting its status to 'INACTIVE'
    vehicle.status = 'INACTIVE';
    await vehicle.save();
  
    res.json({success:true, message: "Vehicle operation overridden by Super Vendor"});
});
  

export const forceVerifyVehicleDocuments = asyncHandler(async (req, res) => {
    const {vehicleId}=req.params;
    const superVendor=req.vendor;

    if (superVendor.role !== 'SUPER') {
        throw new ApiError(403,"Access Denied")
    }

    const vehicle=await Vehicle.findById(vehicleId);

    if(!vehicle) throw new ApiError(404,"vehicle not found")

    // Filter unverified documents with valid fileUrl
    const documents=vehicle.documents.filter(document=>(document.fileUrl!="" && !document.verified))

    if(documents.length==0) throw new ApiError(400,"All documents are verified")

    // Mark all unverified documents true
    documents.forEach(document => {
        document.verified = true;
    })

    await vehicle.save()

    return res.status(200).json({success:true,message:"Documents verified successfully!"})
})


export const forceVerifyDriverLicense = asyncHandler(async (req, res) => {
    const {driverId}=req.params;
    const superVendor=req.vendor;

    if (superVendor.role !== 'SUPER') {
        throw new ApiError(403,"Access Denied")
    }

    const driver=await Driver.findById(driverId);

    if(!driver) throw new ApiError(404,"driver not found")

    const {license}=driver

     // Check if the license is already verified
    if(license.verified) throw new ApiError(400,"License already verified")
    
    license.verified=true
    driver.status="AVAILABLE"

    await driver.save()

    return res.status(200).json({success:true,message:"License verified successfully!"})
})