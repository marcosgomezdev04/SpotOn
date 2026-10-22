import { IBooking } from "../../interfaces/booking.interface";

export interface IBookingRepository {
    create(bookingData: Partial<IBooking>): Promise<IBooking>;

    findAll(): Promise<IBooking[]>;

    findById(id: string): Promise<IBooking | null>;

    findByUserId(userId: string): Promise<IBooking[]>;

    existsByScheduleId(
        scheduleId: string,
        status?: "CONFIRMED" | "CANCELLED"
    ): Promise<boolean>;

    update(
        id: string,
        bookingData: Partial<IBooking>
    ): Promise<IBooking | null>;

    delete(id: string): Promise<IBooking | null>;
} 