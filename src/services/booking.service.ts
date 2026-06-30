import { IBooking } from "../interfaces/booking.interface";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";

export class BookingService {

    constructor(
        private readonly bookingRepository: IBookingRepository
    ) {}

    public async create(bookingData: IBooking): Promise<IBooking> {
        return await this.bookingRepository.create(bookingData);
    }

    public async getAll(): Promise<IBooking[]> {
        return await this.bookingRepository.findAll();
    }

    public async getById(id: string): Promise<IBooking | null> {
        return await this.bookingRepository.findById(id);
    }

    public async getByUserId(userId: string): Promise<IBooking[]> {
        return await this.bookingRepository.findByUserId(userId);
    }

    public async delete(id: string): Promise<IBooking | null> {
        return await this.bookingRepository.delete(id);
    }
}