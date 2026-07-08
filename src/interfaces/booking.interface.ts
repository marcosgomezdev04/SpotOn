import { Types } from "mongoose";

export interface IBooking {
    id?: string;
    userId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    status: "CONFIRMED" | "CANCELLED";
}