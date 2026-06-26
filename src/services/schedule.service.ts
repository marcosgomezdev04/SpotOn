import { ISchedule } from "../interfaces/schedule.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class ScheduleService {

    constructor(
        private readonly scheduleRepository: IScheduleRepository
    ) {}

    public async createSchedule(
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule> {
        return await this.scheduleRepository.create(scheduleData);
    }

    public async getAvailableSchedules(): Promise<ISchedule[]> {
        return await this.scheduleRepository.findAvailable();
    }
}