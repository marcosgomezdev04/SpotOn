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
            "/post",
            this.scheduleController.createSchedule
        );

        this.router.get(
            "/getAll",
            this.scheduleController.getSchedules
        );

        this.router.get(
            "/getById/:id",
            this.scheduleController.getScheduleById
        );

        this.router.delete(
            "/delete/:id",
            this.scheduleController.deleteSchedule
        );

        this.router.put(
            "/update/:id",
            this.scheduleController.updateSchedule
        );
    }
}