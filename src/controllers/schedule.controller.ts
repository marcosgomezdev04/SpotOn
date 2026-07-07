import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";

export class ScheduleController {

    constructor(
        private readonly scheduleService: ScheduleService
    ) {}

    public createSchedule = async (req: Request, res: Response) => {

        try {
            const schedule =
                await this.scheduleService.createSchedule({
                    ...req.body,
                    userId: (req as any).userId
                });
            res.status(201).json(schedule);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };

    public getSchedules = async (req: Request, res: Response) => {

        const schedules =
            await this.scheduleService.getSchedules();

        res.status(200).json(schedules);
    };

    public getScheduleById = async (req: Request, res: Response) => {

        const schedule =
            await this.scheduleService.getScheduleById(
                req.params.id as string
            );

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }
        res.status(200).json(schedule);
    };

    public deleteSchedule = async (req: Request, res: Response) => {

        const schedule =
            await this.scheduleService.deleteSchedule(
                req.params.id as string
            );

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        res.status(200).json({
            message: "Schedule deleted"
        });
    };

    public updateSchedule = async (req: Request, res: Response) => {

        try {
            const schedule =
                await this.scheduleService.updateSchedule(
                    req.params.id as string,
                    req.body
                );

            if (!schedule) {
                return res.status(404).json({
                    message: "Schedule not found"
                });
            }
            res.status(200).json(schedule);

        } catch (error: any) {
            res.status(400).json({
                message: error.message
            });
        }
    };
}