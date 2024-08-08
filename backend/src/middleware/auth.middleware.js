import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")  // pahle ham check kar rhe hai cookie hai ki nhi cookie nahi hoga tab user bhaije ga user aaise hi bhaijta hai bearer karke 
    
        if (!token){
            throw new ApiError (401 , "Unorthorized Token");
        }
        // agar token mil gaya tab jwt se puchna padega yeh sahi hai ki nhi toh jwty ke paas puchne ja rahe hai 
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select ("-password -refreshToken")
    
        if (!user){
            throw new ApiError(401 , "Invalid access Token")
        }
        req.user = user;
        next ();
    } catch (error) {
        throw new ApiError(401 , error?.message || "invalid access token")
    }
})