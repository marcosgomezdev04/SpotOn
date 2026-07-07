import { Types } from "mongoose";

export interface ISchedule {
    id?: string;
    fieldName: string;
    date: Date;
    startTime: string;
    endTime: string;
    userId: Types.ObjectId;
}