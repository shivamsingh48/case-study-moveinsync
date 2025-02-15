import jwt from 'jsonwebtoken'
import { Vendor } from '../models/vendor.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asynchandler.js';

export const generateAuthToken = (vendor) => {
    return jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: '7d' }
    );
};
  
  // Login endpoint
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password)
      throw new ApiError(400,"All fields are required")
    
    const vendor = await Vendor.findOne({ email })

    const checkPassword=await vendor.isPasswordCheck(password);
    
    if (!vendor || !checkPassword) {
      throw new ApiError(401, 'Invalid credentials');
    }
  
    const token = generateAuthToken(vendor);
    if(!token) throw new ApiError("Error while generating accessToken")

    res.status(200)
    .cookie("accessToken",token,
      {maxAge: 15 * 24 * 60 * 60 * 1000,
        secure:true,
        sameSite:"None"}
    )
    .json({
        success:true,
        vendor:{
          _id: vendor._id,
          name: vendor.name,
          email: vendor.email,
          role: vendor.role
        },
        message:"Login successfully"
    })
});

export const logout = asyncHandler(async (req, res) => {
  
  const vendorId=req.vendor?._id

  const vendor =await Vendor.findById(vendorId)

  if(!vendor) throw new ApiError(404,"No vendor found")

  res.status(200)
  .clearCookie("accessToken",{secure:true,sameSite:"None"})
  .json({
      success:true,
      message:"Logged out successfully"
  })
});