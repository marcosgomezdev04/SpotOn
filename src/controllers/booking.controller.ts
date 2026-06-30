import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

export class BookingController {

    constructor(
        private readonly bookingService: BookingService
    ) {}

    public createBooking = async (req: Request, res: Response) => {

        try {
            const booking = await this.bookingService.create(req.body);
            res.status(201).json(booking);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };

    public getAllBookings = async (_req: Request, res: Response) => {

        try {
            const bookings = await this.bookingService.getAll();
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
            res.status(200).json(booking);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };

    public deleteBooking = async (req: Request, res: Response) => {

        try {
            const booking = await this.bookingService.delete(req.params.id as string);
            res.status(200).json(booking);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };
}