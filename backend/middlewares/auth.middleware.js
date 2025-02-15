import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
import { Vendor } from '../models/vendor.model.js';
import {asyncHandler} from '../utils/asynchandler.js'

export const auth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken;
    if(!token) throw new ApiError(401,"Invalid authorization")

    const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);

    if(!decoded) throw new ApiError(500,"Internal server error");

    // Find vendor and attach to request
    req.vendor = await Vendor.findOne({
        _id: decoded.id,
    });

    next();
})