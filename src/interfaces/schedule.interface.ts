export interface ISchedule {
    _id?: string;
    date: Date;
    startTime: string;
    endTime: string;
    available: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
