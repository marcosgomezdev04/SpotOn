import { Schema, model } from "mongoose";
import { ISchedule } from "../interfaces/schedule.interface";

const ScheduleSchema = new Schema<ISchedule>(
    {
        fieldName: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const ScheduleModel = model<ISchedule>("Schedule", ScheduleSchema);
