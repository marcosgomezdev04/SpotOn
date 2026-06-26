import { ISchedule } from "../interfaces/schedule.interface";
import { ScheduleModel } from "../models/schedule.model";
import { IScheduleRepository } from "./interface/schedule.repository.interface";

export class ScheduleRepository implements IScheduleRepository {
    public async findById(
        id: string
    ): Promise<ISchedule | null> {
        return await ScheduleModel.findById(id);
    }

    public async update(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null> {
        return await ScheduleModel.findByIdAndUpdate(
            id,
            scheduleData,
            {
                new: true,
            }
        );
    }
}
