import mongoose from "mongoose";

export class MongoDB {

    public static async connect(): Promise<void> {

        try {
            await mongoose.connect(process.env.MONGO_URI!);
            console.log("MongoDB connected");
            
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    }
}