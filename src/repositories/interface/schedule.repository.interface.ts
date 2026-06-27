import { ISchedule } from "../../interfaces/schedule.interface";

export interface IScheduleRepository {

    create(scheduleData: Partial<ISchedule>): Promise<ISchedule>;

    findAll(): Promise<ISchedule[]>;

    findById(id: string): Promise<ISchedule | null>;

    update(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null>;

    delete(id: string): Promise<ISchedule | null>;
}