import { ISchedule } from "../interfaces/schedule.interface";
import { ScheduleModel } from "../models/schedule.model";
import { IScheduleRepository } from "./interface/schedule.repository.interface";

export class ScheduleRepository implements IScheduleRepository {

    public async create(
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule> {
        return await ScheduleModel.create(scheduleData);
    }

    public async findAll(): Promise<ISchedule[]> {
        return await ScheduleModel.find();
    }

    public async findByUserId(userId: string): Promise<ISchedule[]> {
        return await ScheduleModel.find({ userId });
    }

    public async findByFieldNameAndDate(
        fieldName: string,
        date: Date
    ): Promise<ISchedule[]> {
        return await ScheduleModel.find({
            fieldName,
            date
        });
    }

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
                new: true
            }
        );
    }

    public async delete(
        id: string
    ): Promise<ISchedule | null> {
        return await ScheduleModel.findByIdAndDelete(id);
    }
}