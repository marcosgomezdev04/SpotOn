import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

export class BookingController {

    constructor(
        private readonly bookingService: BookingService
    ) {}

    public createBooking = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.createBooking({
                    ...req.body,
                    userId: (req as any).userId
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

            const bookings =
                await this.bookingService.getAllBookings();

            res.status(200).json(bookings);

        } catch (error: any) {

            res.status(500).json({
                message: error.message
            });
        }
    };

    public getBookingById = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.getBookingById(
                    req.params.id as string
                );

            res.status(200).json(booking);

        } catch (error: any) {

            res.status(404).json({
                message: error.message
            });
        }
    };

    public getMyBookings = async (req: Request, res: Response) => {

        try {

            const bookings =
                await this.bookingService.getBookingsByUserId(
                    (req as any).userId
                );

            res.status(200).json(bookings);

        } catch (error: any) {

            res.status(400).json({
                message: error.message
            });
        }
    };

    public updateBooking = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.updateBooking(
                    req.params.id as string,
                    req.body
                );

            res.status(200).json(booking);

        } catch (error: any) {

            res.status(400).json({
                message: error.message
            });
        }
    };

    public deleteBooking = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.deleteBooking(
                    req.params.id as string
                );

            res.status(200).json(booking);

        } catch (error: any) {

            res.status(404).json({
                message: error.message
            });
        }
    };
}