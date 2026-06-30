import { ISchedule } from "../interfaces/schedule.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class ScheduleService {

    constructor(
        private readonly scheduleRepository: IScheduleRepository
    ) {}

    private parseTimeToMinutes(time: string): number {
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
            throw new Error("All fields are required.");
        }

        const startMinutes = this.parseTimeToMinutes(scheduleData.startTime);
        const endMinutes = this.parseTimeToMinutes(scheduleData.endTime);

        if (startMinutes >= endMinutes) {
            throw new Error("Start time must be before end time.");
        }

        const schedules = await this.scheduleRepository.findByFieldNameAndDate(
            scheduleData.fieldName,
            scheduleData.date
        );

        for (const schedule of schedules) {

            const existingStartMinutes = this.parseTimeToMinutes(schedule.startTime);
            const existingEndMinutes = this.parseTimeToMinutes(schedule.endTime);

            const overlaps =
                startMinutes < existingEndMinutes &&
                endMinutes > existingStartMinutes;

            if (overlaps) {
                throw new Error("This field is already reserved for that time.");
            }
        }

        return await this.scheduleRepository.create(scheduleData);
    }

    public async getSchedules(): Promise<ISchedule[]> {
        return await this.scheduleRepository.findAll();
    }

    public async getScheduleById(
        id: string
    ): Promise<ISchedule | null> {

        const schedule = await this.scheduleRepository.findById(id);

        if (!schedule) {
            throw new Error("Schedule not found.");
        }

        return schedule;
    }

    public async deleteSchedule(
        id: string
    ): Promise<ISchedule | null> {

        const schedule = await this.scheduleRepository.findById(id);

        if (!schedule) {
            throw new Error("Schedule not found.");
        }

        return await this.scheduleRepository.delete(id);
    }

    public async updateSchedule(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null> {

        const schedule = await this.scheduleRepository.findById(id);

        if (!schedule) {
            throw new Error("Schedule not found.");
        }

        const fieldName = scheduleData.fieldName ?? schedule.fieldName;
        const date = scheduleData.date ?? schedule.date;
        const startTime = scheduleData.startTime ?? schedule.startTime;
        const endTime = scheduleData.endTime ?? schedule.endTime;

        const startMinutes = this.parseTimeToMinutes(startTime);
        const endMinutes = this.parseTimeToMinutes(endTime);

        if (startMinutes >= endMinutes) {
            throw new Error("Start time must be before end time.");
        }

        const schedules = await this.scheduleRepository.findByFieldNameAndDate(
            fieldName,
            date
        );

        for (const existingSchedule of schedules) {

            // Ignorar el horario que se está editando
            if (existingSchedule.id?.toString() === id) {
                continue;
            }

            const existingStartMinutes = this.parseTimeToMinutes(
                existingSchedule.startTime
            );

            const existingEndMinutes = this.parseTimeToMinutes(
                existingSchedule.endTime
            );

            const overlaps =
                startMinutes < existingEndMinutes &&
                endMinutes > existingStartMinutes;

            if (overlaps) {
                throw new Error("This field is already reserved for that time.");
            }
        }

        return await this.scheduleRepository.update(id, {
            fieldName,
            date,
            startTime,
            endTime
        });
    }
}