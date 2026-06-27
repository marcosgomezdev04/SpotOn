import { ISchedule } from "../interfaces/schedule.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class ScheduleService {

    constructor(
        private readonly scheduleRepository: IScheduleRepository
    ) {}

    public async createSchedule(
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule> {
        return await this.scheduleRepository.create(
            scheduleData
        );
    }

    public async getSchedules(): Promise<ISchedule[]> {
        return await this.scheduleRepository.findAll();
    }

    public async getScheduleById(
        id: string
    ): Promise<ISchedule | null> {
        return await this.scheduleRepository.findById(id);
    }

    public async deleteSchedule(
        id: string
    ): Promise<ISchedule | null> {
        return await this.scheduleRepository.delete(id);
    }

    public async updateSchedule(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null> {
        return await this.scheduleRepository.update(
            id,
            scheduleData
        );
    }
}