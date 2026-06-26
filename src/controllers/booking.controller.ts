import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

export class BookingController {
    constructor(
        private readonly bookingService: BookingService
    ) {}

    public createBooking = async (
        req: Request,
        res: Response
    ) => {
        try {
            const userId = (req as any).user?.id as string;
            const { scheduleId } = req.body;

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }

            if (!scheduleId) {
                return res.status(400).json({
                    message: "scheduleId is required",
                });
            }

            const booking = await this.bookingService.createBooking(
                scheduleId,
                userId
            );

            res.status(201).json(booking);
        } catch (error: any) {
            res.status(400).json({
                message: error.message,
            });
        }
    };

    public cancelBooking = async (
        req: Request,
        res: Response
    ) => {
        try {
            const userId = (req as any).user?.id as string;
            const bookingId = req.params.id as string;

            if (!userId) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }

            const booking = await this.bookingService.cancelBooking(
                bookingId,
                userId
            );

            res.status(200).json(booking);
        } catch (error: any) {
            const message = error.message || "An error occurred";

            if (message === "Booking not found") {
                return res.status(404).json({ message });
            }

            if (message === "Unauthorized") {
                return res.status(403).json({ message });
            }

            res.status(400).json({ message });
        }
    };
}
