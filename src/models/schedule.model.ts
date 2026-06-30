import { Schema, model } from "mongoose";
import { ISchedule } from "../interfaces/schedule.interface";

const ScheduleSchema = new Schema<ISchedule>(
    {
        fieldName: {
            type: String,
            required: true,
            enum: [
                "Cancha 1",
                "Cancha 2",
                "Cancha 3",
                "Cancha 4",
                "Cancha 5"
            ]
        },

        date: {
            type: Date,
            required: true
        },

        startMinutes: {
            type: Number,
            required: true
        },

        endMinutes: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

ScheduleSchema.index(
    {
        fieldName: 1,
        date: 1,
        startMinutes: 1,
        endMinutes: 1
    },
    {
        unique: true
    }
);

export const ScheduleModel = model<ISchedule>("Schedule", ScheduleSchema);