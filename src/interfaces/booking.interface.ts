import { Types } from 'mongoose';

export interface IBooking {
    _id?: string;
    userId: Types.ObjectId;
    scheduleId: Types.ObjectId;
    status: string;
}
