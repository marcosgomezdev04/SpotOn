import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";

export class ScheduleRoutes {

    public readonly router: Router;

    constructor(
        private readonly scheduleController: ScheduleController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            "/schedules",
            this.scheduleController.createSchedule
        );

        this.router.get(
            "/schedules/available",
            this.scheduleController.getAvailableSchedules
        );
    }
}