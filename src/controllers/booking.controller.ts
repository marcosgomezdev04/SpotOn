import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { HttpError } from "../errors/http-error";

export class BookingController {

    constructor(
        private readonly bookingService: BookingService
    ) {}

    private handleError(error: unknown, res: Response): void {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({
                message: error.message
            });
            return;
        }

        if (
            error instanceof Error &&
            (
                error.name === "ValidationError" ||
                error.name === "CastError"
            )
        ) {
            res.status(400).json({
                message: "Los datos de la reserva no son válidos."
            });
            return;
        }

        res.status(500).json({
            message: "No se pudo completar la operación."
        });
    }

    public createBooking = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.createBooking({
                    scheduleId: req.body?.scheduleId,
                    userId: (req as any).userId
                });

            res.status(201).json(booking);

        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getAllBookings = async (req: Request, res: Response) => {

        try {

            const bookings =
                await this.bookingService.getAllBookings();

            res.status(200).json(bookings);

        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getBookingById = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.getBookingById(
                    req.params.id as string
                );

            res.status(200).json(booking);

        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getMyBookings = async (req: Request, res: Response) => {

        try {

            const bookings =
                await this.bookingService.getBookingsByUserId(
                    (req as any).userId
                );

            res.status(200).json(bookings);

        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateBooking = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.updateBooking(
                    req.params.id as string,
                    req.body ?? {}
                );

            res.status(200).json(booking);

        } catch (error) {
            this.handleError(error, res);
        }
    };

    public deleteBooking = async (req: Request, res: Response) => {

        try {

            const booking =
                await this.bookingService.deleteBooking(
                    req.params.id as string
                );

            res.status(200).json(booking);

        } catch (error) {
            this.handleError(error, res);
        }
    };
}
