import { IBooking } from "../interfaces/booking.interface";
import { BookingRepository } from "../repositories/booking.repository";
import { ScheduleRepository } from "../repositories/schedule.repository";

export class BookingService {

    constructor(
        private bookingRepository = new BookingRepository(),
        private scheduleRepository = new ScheduleRepository()
    ) {}

    public async createBooking(
        bookingData: Partial<IBooking>
    ): Promise<IBooking> {

        if (!bookingData.userId) {
            throw new Error("User is required.");
        }

        if (!bookingData.scheduleId) {
            throw new Error("Schedule is required.");
        }

        const schedule = await this.scheduleRepository.findById(
            bookingData.scheduleId.toString()
        );

        if (!schedule) {
            throw new Error("Schedule not found.");
        }

        if (schedule.status === "BOOKED") {
            throw new Error("This schedule is already booked.");
        }

        const booking = await this.bookingRepository.create(
            bookingData
        );

        await this.scheduleRepository.update(
            bookingData.scheduleId.toString(),
            {
                status: "BOOKED"
            }
        );

        return booking;
    }

    public async getAllBookings(): Promise<IBooking[]> {

        return await this.bookingRepository.findAll();
    }

    public async getBookingById(
        id: string
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new Error("Booking not found.");
        }

        return booking;
    }

    public async getBookingsByUserId(
        userId: string
    ): Promise<IBooking[]> {

        return await this.bookingRepository.findByUserId(userId);
    }

    public async deleteBooking(
        id: string
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new Error("Booking not found.");
        }

        const updatedBooking = await this.bookingRepository.update(
            id,
            {
                status: "CANCELLED"
            }
        );

        await this.scheduleRepository.update(
            booking.scheduleId.toString(),
            {
                status: "AVAILABLE"
            }
        );

        return updatedBooking;
    }
}