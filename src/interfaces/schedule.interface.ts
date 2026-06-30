export interface ISchedule {
    id?: string;
    fieldName: string;
    date: Date;
    startMinutes: number;
    endMinutes: number;
}