import { ISchedule } from "../../interfaces/schedule.interface";

export interface IScheduleRepository {

    create(scheduleData: Partial<ISchedule>): Promise<ISchedule>;

    findAll(): Promise<ISchedule[]>;

    findByFieldNameAndDate(
        fieldName: string,
        date: Date
    ): Promise<ISchedule[]>;

    findById(id: string): Promise<ISchedule | null>;

    update(
        id: string,
        scheduleData: Partial<ISchedule>
    ): Promise<ISchedule | null>;

    delete(id: string): Promise<ISchedule | null>;

    // Marca el horario como BOOKED solo si estaba AVAILABLE, en una única
    // operación atómica. Devuelve null si ya estaba reservado (o no existe).
    reserveIfAvailable(id: string): Promise<ISchedule | null>;
}