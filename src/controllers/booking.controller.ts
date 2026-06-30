import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

export class BookingController {

    constructor(
        private readonly bookingService: BookingService
    ) {}

    public createBooking = async (req: Request, res: Response) => {

        try {
            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const booking = await this.bookingService.create({
                ...req.body,
                userId: currentUser.id
            });

            res.status(201).json(booking);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };

    public getAllBookings = async (req: Request, res: Response) => {

        try {
            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const bookings = currentUser.role === "ADMIN"
                ? await this.bookingService.getAll()
                : await this.bookingService.getByUserId(currentUser.id);

            res.status(200).json(bookings);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };

    public getBookingById = async (req: Request, res: Response) => {

        try {
            const booking = await this.bookingService.getById(req.params.id as string);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (currentUser.role !== "ADMIN" && booking.userId.toString() !== currentUser.id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            res.status(200).json(booking);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };

    public deleteBooking = async (req: Request, res: Response) => {

        try {
            const booking = await this.bookingService.getById(req.params.id as string);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            const currentUser = (req as any).user;

            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (currentUser.role !== "ADMIN" && booking.userId.toString() !== currentUser.id) {
                return res.status(403).json({ message: "Forbidden" });
            }

            const deletedBooking = await this.bookingService.delete(req.params.id as string);
            res.status(200).json(deletedBooking);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };
}