import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { authMiddleware, requireAdmin } from "../middlewares/auth.middleware";

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
            authMiddleware,
            requireAdmin,
            this.scheduleController.createSchedule
        );

        this.router.get(
            "/getAll",
            authMiddleware,
            this.scheduleController.getSchedules
        );

        this.router.get(
            "/getById/:id",
            authMiddleware,
            this.scheduleController.getScheduleById
        );

        this.router.delete(
            "/delete/:id",
            authMiddleware,
            requireAdmin,
            this.scheduleController.deleteSchedule
        );

        this.router.put(
            "/update/:id",
            authMiddleware,
            requireAdmin,
            this.scheduleController.updateSchedule
        );
    }
}