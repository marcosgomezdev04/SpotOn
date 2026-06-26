export interface IBooking {
    _id?: string;
    scheduleId: string;
    userId: string;
    status: "active" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}
