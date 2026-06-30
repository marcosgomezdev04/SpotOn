import { Schema, model } from "mongoose";
import { IBooking } from "../interfaces/booking.interface";

const bookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        scheduleId: {
            type: Schema.Types.ObjectId,
            ref: "Schedule",
            required: true,
            unique: true
        },
        
        status: {
            type: String,
            required: true,
            enum: ["PENDING", "CONFIRMED", "CANCELLED"],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

export const BookingModel = model<IBooking>("Booking", bookingSchema);