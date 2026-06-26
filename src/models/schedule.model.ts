import { Schema, model } from "mongoose";
import { ISchedule } from "../interfaces/schedule.interface";

const ScheduleSchema = new Schema<ISchedule>(
    {
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ScheduleModel = model<ISchedule>("Schedule", ScheduleSchema);
