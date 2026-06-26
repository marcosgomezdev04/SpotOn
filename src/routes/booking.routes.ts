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
            "/bookings",
            authMiddleware,
            this.bookingController.createBooking
        );

        this.router.delete(
            "/bookings/:id",
            authMiddleware,
            this.bookingController.cancelBooking
        );
    }
}
