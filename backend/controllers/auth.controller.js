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
    
    const vendor = await Vendor.findOne({ email })
    if (!vendor || !(await vendor.isPasswordCheck(password))) {
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