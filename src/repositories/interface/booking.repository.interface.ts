import { IBooking } from "../../interfaces/booking.interface";

export interface IBookingRepository {
    create(bookingData: Partial<IBooking>): Promise<IBooking>;
    findById(id: string): Promise<IBooking | null>;
    findActiveByScheduleId(scheduleId: string): Promise<IBooking | null>;
    updateStatus(
        id: string,
        status: "active" | "cancelled"
    ): Promise<IBooking | null>;
}
