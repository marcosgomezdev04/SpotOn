import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";

export class ScheduleController {

    constructor(
        private readonly scheduleService: ScheduleService
    ) {}

    public createSchedule = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const schedule = await this.scheduleService.createSchedule(req.body);
            res.status(201).json(schedule);
        } catch (error) {
            res.status(500).json({
                message: "Error creating schedule",
                error
            });
        }
    };

    public getAvailableSchedules = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const schedules = await this.scheduleService.getAvailableSchedules();
            res.status(200).json(schedules);
        } catch (error) {
            res.status(500).json({
                message: "Error getting available schedules",
                error
            });
        }
    };
}