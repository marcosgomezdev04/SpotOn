import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { ScheduleService } from "../services/schedule.service";
import { HttpError } from "../errors/http-error";

export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService
    ) {}

    private getId(req: Request): string {
        const id = req.params.id;

        if (typeof id !== "string" || !isValidObjectId(id)) {
            throw new HttpError(
                400,
                "El identificador del horario no es válido."
            );
        }

        return id;
    }

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
                message: "Los datos del horario no son válidos."
            });
            return;
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === 11000
        ) {
            res.status(409).json({
                message: "Ya existe un horario con esos datos."
            });
            return;
        }

        res.status(500).json({
            message: "No se pudo completar la operación."
        });
    }

    public createSchedule = async (req: Request, res: Response) => {
        try {
            const schedule = await this.scheduleService.createSchedule(
                req.body ?? {}
            );

            res.status(201).json(schedule);
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    public getSchedules = async (_req: Request, res: Response) => {
        try {
            const schedules = await this.scheduleService.getSchedules();
            res.status(200).json(schedules);
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    public getScheduleById = async (req: Request, res: Response) => {
        try {
            const schedule = await this.scheduleService.getScheduleById(
                this.getId(req)
            );

            res.status(200).json(schedule);
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    public deleteSchedule = async (req: Request, res: Response) => {
        try {
            await this.scheduleService.deleteSchedule(this.getId(req));

            res.status(200).json({
                message: "Horario eliminado correctamente."
            });
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };

    public updateSchedule = async (req: Request, res: Response) => {
        try {
            const schedule = await this.scheduleService.updateSchedule(
                this.getId(req),
                req.body ?? {}
            );

            res.status(200).json(schedule);
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    };
} 