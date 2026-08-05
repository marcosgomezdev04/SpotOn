import { IBooking } from "../interfaces/booking.interface";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class BookingService {

    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly scheduleRepository: IScheduleRepository
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

        const scheduleId = bookingData.scheduleId.toString();

        const schedule = await this.scheduleRepository.findById(scheduleId);

        if (!schedule) {
            throw new Error("Schedule not found.");
        }

        if (schedule.status === "BOOKED") {
            throw new Error("This schedule is already booked.");
        }

        const existingBooking = await this.bookingRepository.findByUserId(
            bookingData.userId.toString()
        );

        const alreadyBooked = existingBooking.some(
            (booking) => booking.scheduleId.toString() === scheduleId
        );

        if (alreadyBooked) {
            throw new Error("You already have a booking for this schedule.");
        }

        const booking = await this.bookingRepository.create({
            ...bookingData,
            status: "CONFIRMED"
        });

        await this.scheduleRepository.update(
            scheduleId,
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

    public async updateBooking(
        id: string,
        bookingData: Partial<IBooking>
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new Error("Booking not found.");
        }

        if (bookingData.userId && bookingData.userId.toString() !== booking.userId.toString()) {
            throw new Error("You cannot change the user of a booking.");
        }

        if (bookingData.scheduleId && bookingData.scheduleId.toString() !== booking.scheduleId.toString()) {
            throw new Error("You cannot change the schedule of a booking.");
        }

        return await this.bookingRepository.update(
            id,
            bookingData
        );
    }

    public async deleteBooking(
        id: string
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new Error("Booking not found.");
        }

        if (booking.status === "CANCELLED") {
            throw new Error("This booking is already cancelled.");
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