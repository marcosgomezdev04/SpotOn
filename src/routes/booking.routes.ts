import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

export class BookingRoutes {

    public readonly router: Router;

    constructor(
        private readonly bookingController: BookingController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        this.router.post(
            "/post",
            this.bookingController.createBooking
        );

        this.router.get(
            "/get",
            this.bookingController.getAllBookings
        );

        this.router.get(
            "/getById/:id",
            this.bookingController.getBookingById
        );

        this.router.delete(
            "/delete/:id",
            this.bookingController.deleteBooking
        );
    }
}