import { IBooking } from "../../interfaces/booking.interface";

export interface IBookingRepository {
    
    create(booking: IBooking): Promise<IBooking>;

    findAll(): Promise<IBooking[]>;

    findById(id: string): Promise<IBooking | null>;

    findByUserId(userId: string): Promise<IBooking[]>;

    update(
        id: string,
        userData: Partial<IBooking>
    ): Promise<IBooking | null>;

    delete(id: string): Promise<IBooking | null>;
}