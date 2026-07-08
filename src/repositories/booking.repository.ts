import { IBooking } from "../interfaces/booking.interface";
import { BookingModel } from "../models/booking.model";
import { IBookingRepository } from "./interface/booking.repository.interface";

export class BookingRepository implements IBookingRepository {

    public async create(
        bookingData: Partial<IBooking>
    ): Promise<IBooking> {
        return await BookingModel.create(bookingData);
    }

    public async findAll(): Promise<IBooking[]> {
        return await BookingModel.find();
    }

    public async findById(
        id: string
    ): Promise<IBooking | null> {
        return await BookingModel.findById(id);
    }

    public async findByUserId(
        userId: string
    ): Promise<IBooking[]> {
        return await BookingModel.find({ userId });
    }

    public async update(
        id: string,
        bookingData: Partial<IBooking>
    ): Promise<IBooking | null> {
        return await BookingModel.findByIdAndUpdate(
            id,
            bookingData,
            {
                new: true
            }
        );
    }

    public async delete(
        id: string
    ): Promise<IBooking | null> {
        return await BookingModel.findByIdAndDelete(id);
    }
}