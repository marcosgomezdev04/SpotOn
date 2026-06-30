import { ISchedule } from "../interfaces/schedule.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

type ScheduleInput = Partial<ISchedule> & {
    fieldName?: string;
    date?: string | Date;
    startTime?: string;
    endTime?: string;
};

export class ScheduleService {

    constructor(
        private readonly scheduleRepository: IScheduleRepository
    ) {}

    private parseMinutes(time: string, fieldName: string): number {
        const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

        if (!match) {
            throw new Error(`${fieldName} must use the HH:mm format.`);
        }

        return Number(match[1]) * 60 + Number(match[2]);
    }

    private normalizeDate(dateValue: string | Date): Date {
        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            throw new Error("Invalid date.");
        }

        date.setUTCHours(0, 0, 0, 0);
        return date;
    }

    private async ensureNoOverlap(
        fieldName: string,
        date: Date,
        startMinutes: number,
        endMinutes: number,
        excludeScheduleId?: string
    ): Promise<void> {
        const schedules = await this.scheduleRepository.findByFieldNameAndDate(
            fieldName,
            date
        );

        for (const schedule of schedules) {
            const scheduleId = schedule.id ?? (schedule as any)._id?.toString();

            if (excludeScheduleId && scheduleId === excludeScheduleId) {
                continue;
            }

            const overlaps =
                startMinutes < schedule.endMinutes &&
                schedule.startMinutes < endMinutes;

            if (overlaps) {
                throw new Error(
                    "The requested schedule overlaps with an existing booking."
                );
            }
        }
    }

    public async createSchedule(
        scheduleData: ScheduleInput
    ): Promise<ISchedule> {
        
        const { fieldName, date, startTime, endTime } = scheduleData;

        if (!fieldName || !date || !startTime || !endTime) {
            throw new Error(
                "fieldName, date, startTime and endTime are required."
            );
        }

        const normalizedDate = this.normalizeDate(date);
        const startMinutes = this.parseMinutes(startTime, "startTime");
        const endMinutes = this.parseMinutes(endTime, "endTime");

        if (endMinutes <= startMinutes) {
            throw new Error("endTime must be later than startTime.");
        }

        await this.ensureNoOverlap(
            fieldName,
            normalizedDate,
            startMinutes,
            endMinutes
        );

        return await this.scheduleRepository.create({
            fieldName,
            date: normalizedDate,
            startMinutes,
            endMinutes
        });
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
        scheduleData: ScheduleInput
    ): Promise<ISchedule | null> {

        const schedule = await this.scheduleRepository.findById(id);

        if (!schedule) {
            throw new Error("Schedule not found.");
        }

        const fieldName = scheduleData.fieldName ?? schedule.fieldName;
        const normalizedDate = scheduleData.date
            ? this.normalizeDate(scheduleData.date)
            : this.normalizeDate(schedule.date);

        const startMinutes = scheduleData.startTime
            ? this.parseMinutes(scheduleData.startTime, "startTime")
            : scheduleData.startMinutes ?? schedule.startMinutes;

        const endMinutes = scheduleData.endTime
            ? this.parseMinutes(scheduleData.endTime, "endTime")
            : scheduleData.endMinutes ?? schedule.endMinutes;

        if (endMinutes <= startMinutes) {
            throw new Error("endTime must be later than startTime.");
        }

        await this.ensureNoOverlap(
            fieldName,
            normalizedDate,
            startMinutes,
            endMinutes,
            id
        );

        return await this.scheduleRepository.update(id, {
            fieldName,
            date: normalizedDate,
            startMinutes,
            endMinutes
        });
    }
}