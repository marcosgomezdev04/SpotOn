import { ISchedule } from "../interfaces/schedule.interface";
import { HttpError } from "../errors/http-error";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";

export class ScheduleService {
    constructor(
        private readonly scheduleRepository: IScheduleRepository,
        private readonly bookingRepository: IBookingRepository
    ) {}

    private parseTimeToMinutes(time: string): number {
        if (
            typeof time !== "string" ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
        ) {
            throw new HttpError(
                400,
                "Las horas deben tener el formato HH:mm."
            );
        }

        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    public async createSchedule(
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule> {
        if (
            !scheduleData.fieldName ||
            !scheduleData.date ||
            !scheduleData.startTime ||
            !scheduleData.endTime
        ) {
            throw new HttpError(400, "Todos los campos son obligatorios.");
        }

        const startMinutes = this.parseTimeToMinutes(
            scheduleData.startTime
        );
        const endMinutes = this.parseTimeToMinutes(
            scheduleData.endTime
        );

        if (startMinutes >= endMinutes) {
            throw new HttpError(
                400,
                "La hora de fin debe ser posterior a la hora de inicio."
            );
        }

        const schedules =
            await this.scheduleRepository.findByFieldNameAndDate(
                scheduleData.fieldName,
                scheduleData.date
            );

        for (const schedule of schedules) {
            const existingStart = this.parseTimeToMinutes(
                schedule.startTime
            );
            const existingEnd = this.parseTimeToMinutes(
                schedule.endTime
            );

            if (
                startMinutes < existingEnd &&
                endMinutes > existingStart
            ) {
                throw new HttpError(
                    409,
                    "El horario se superpone con otro de la misma cancha."
                );
            }
        }

        return await this.scheduleRepository.create({
            fieldName: scheduleData.fieldName,
            date: scheduleData.date,
            startTime: scheduleData.startTime,
            endTime: scheduleData.endTime,
            status: "AVAILABLE"
        });
    }

    public async getSchedules(): Promise<ISchedule[]> {
        return await this.scheduleRepository.findAll();
    }

    public async getScheduleById(id: string): Promise<ISchedule> {
        const schedule = await this.scheduleRepository.findById(id);

        if (!schedule) {
            throw new HttpError(404, "El horario no existe.");
        }

        return schedule;
    }

    public async deleteSchedule(id: string): Promise<ISchedule | null> {
        const schedule = await this.getScheduleById(id);

        // Sin filtro de estado: incluye confirmadas y canceladas.
        const hasBookings =
            await this.bookingRepository.existsByScheduleId(id);

        if (hasBookings || schedule.status === "BOOKED") {
            throw new HttpError(
                409,
                "No se puede eliminar un horario reservado o con reservas asociadas. Debe conservarse el historial."
            );
        }

        const deleted = await this.scheduleRepository.delete(id);

        if (!deleted) {
            throw new HttpError(404, "El horario ya no existe.");
        }

        return deleted;
    }

    public async updateSchedule(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null> {
        const schedule = await this.getScheduleById(id);

        const hasConfirmedBookings =
            await this.bookingRepository.existsByScheduleId(
                id,
                "CONFIRMED"
            );

        if (hasConfirmedBookings || schedule.status === "BOOKED") {
            throw new HttpError(
                409,
                "No se puede editar un horario que tiene una reserva confirmada."
            );
        }

        const fieldName = scheduleData.fieldName ?? schedule.fieldName;
        const date = scheduleData.date ?? schedule.date;
        const startTime = scheduleData.startTime ?? schedule.startTime;
        const endTime = scheduleData.endTime ?? schedule.endTime;

        const startMinutes = this.parseTimeToMinutes(startTime);
        const endMinutes = this.parseTimeToMinutes(endTime);

        if (startMinutes >= endMinutes) {
            throw new HttpError(
                400,
                "La hora de fin debe ser posterior a la hora de inicio."
            );
        }

        const schedules =
            await this.scheduleRepository.findByFieldNameAndDate(
                fieldName,
                date
            );

        for (const existingSchedule of schedules) {
            if (existingSchedule.id?.toString() === id) {
                continue;
            }

            const existingStart = this.parseTimeToMinutes(
                existingSchedule.startTime
            );
            const existingEnd = this.parseTimeToMinutes(
                existingSchedule.endTime
            );

            if (
                startMinutes < existingEnd &&
                endMinutes > existingStart
            ) {
                throw new HttpError(
                    409,
                    "El horario se superpone con otro de la misma cancha."
                );
            }
        }

        const updated = await this.scheduleRepository.update(id, {
            fieldName,
            date,
            startTime,
            endTime
        });

        if (!updated) {
            throw new HttpError(404, "El horario ya no existe.");
        }

        return updated;
    }
} 