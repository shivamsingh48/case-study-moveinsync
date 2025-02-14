import mongoose from "mongoose";

export const connectMongoDB=async()=>{
    try {
        
        const instanceURL=await mongoose.connect(`${process.env.MONGODB_URL}/vendorsystem`)
        console.log("MongoDB connection successfull");

    } catch (error) {
        console.log("Failed to connect mongoDB ",error)
        process.exit(1)
    }
}