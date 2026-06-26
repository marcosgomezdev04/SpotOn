import { IBooking } from "../interfaces/booking.interface";
import { BookingModel } from "../models/booking.model";
import { IBookingRepository } from "./interface/booking.repository.interface";

export class BookingRepository implements IBookingRepository {
    public async create(
        bookingData: Partial<IBooking>
    ): Promise<IBooking> {
        return await BookingModel.create(bookingData);
    }

    public async findById(
        id: string
    ): Promise<IBooking | null> {
        return await BookingModel.findById(id);
    }

    public async findActiveByScheduleId(
        scheduleId: string
    ): Promise<IBooking | null> {
        return await BookingModel.findOne({
            scheduleId,
            status: "active"
        });
    }

    public async updateStatus(
        id: string,
        status: "active" | "cancelled"
    ): Promise<IBooking | null> {
        return await BookingModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
    }
}
