import { ISchedule } from "../interfaces/schedule.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class ScheduleService {

    constructor(
        private readonly scheduleRepository: IScheduleRepository
    ) {}

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

        if (scheduleData.startTime >= scheduleData.endTime) {
            throw new Error("Start time must be before end time.");
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

        const startTime = scheduleData.startTime ?? schedule.startTime;
        const endTime = scheduleData.endTime ?? schedule.endTime;

        if (startTime >= endTime) {
            throw new Error("Start time must be before end time.");
        }

        return await this.scheduleRepository.update(id, scheduleData);
    }
}