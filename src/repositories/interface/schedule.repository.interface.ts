import { ISchedule } from "../../interfaces/schedule.interface";

export interface IScheduleRepository {
    findById(id: string): Promise<ISchedule | null>;
    update(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null>;
}
