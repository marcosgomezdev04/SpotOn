import { IBooking } from "../interfaces/booking.interface";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class BookingService {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly scheduleRepository: IScheduleRepository
    ) {}

    public async createBooking(
        scheduleId: string,
        userId: string
    ): Promise<IBooking> {
        const schedule = await this.scheduleRepository.findById(scheduleId);

        if (!schedule) {
            throw new Error("Schedule not found");
        }

        if (!schedule.available) {
            throw new Error("Schedule is not available");
        }

        const existingBooking =
            await this.bookingRepository.findActiveByScheduleId(
                scheduleId
            );

        if (existingBooking) {
            throw new Error("Schedule already has an active booking");
        }

        const booking = await this.bookingRepository.create({
            scheduleId,
            userId,
            status: "active",
        });

        await this.scheduleRepository.update(scheduleId, {
            available: false,
        });

        return booking;
    }

    public async cancelBooking(
        id: string,
        userId: string
    ): Promise<IBooking> {
        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.userId.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        if (booking.status === "cancelled") {
            throw new Error("Booking is already cancelled");
        }

        const cancelledBooking =
            await this.bookingRepository.updateStatus(id, "cancelled");

        await this.scheduleRepository.update(booking.scheduleId, {
            available: true,
        });

        if (!cancelledBooking) {
            throw new Error("Unable to cancel booking");
        }

        return cancelledBooking;
    }
}
