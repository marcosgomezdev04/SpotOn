import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

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
            authMiddleware,
            this.bookingController.createBooking
        );

        this.router.get(
            "/get",
            authMiddleware,
            this.bookingController.getAllBookings
        );

        this.router.get(
            "/getById/:id",
            authMiddleware,
            this.bookingController.getBookingById
        );

        this.router.delete(
            "/delete/:id",
            authMiddleware,
            this.bookingController.deleteBooking
        );
    }
}