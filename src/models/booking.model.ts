import { Schema, model } from "mongoose";
import { IBooking } from "../interfaces/booking.interface";

const BookingSchema = new Schema<IBooking>(
    {
        scheduleId: {
            type: Schema.Types.ObjectId as any,
            ref: "Schedule",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId as any,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export const BookingModel = model<IBooking>("Booking", BookingSchema);
