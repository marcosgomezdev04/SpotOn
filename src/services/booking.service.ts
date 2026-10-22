import { IBooking } from "../interfaces/booking.interface";
import { HttpError } from "../errors/http-error";
import { IBookingRepository } from "../repositories/interface/booking.repository.interface";
import { IScheduleRepository } from "../repositories/interface/schedule.repository.interface";

export class BookingService {

    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly scheduleRepository: IScheduleRepository
    ) {}

    public async createBooking(
        bookingData: Partial<IBooking>
    ): Promise<IBooking> {

        if (!bookingData.userId) {
            throw new HttpError(400, "El usuario es obligatorio.");
        }

        if (!bookingData.scheduleId) {
            throw new HttpError(400, "El horario es obligatorio.");
        }

        const userId = bookingData.userId.toString();
        const scheduleId = bookingData.scheduleId.toString();

        const schedule = await this.scheduleRepository.findById(scheduleId);

        if (!schedule) {
            throw new HttpError(404, "El horario no existe.");
        }

        if (schedule.status === "BOOKED") {
            throw new HttpError(409, "Este horario ya está reservado.");
        }

        // Una reserva cancelada no cuenta: se puede volver a reservar el mismo horario.
        const userBookings = await this.bookingRepository.findByUserId(userId);

        const alreadyBooked = userBookings.some(
            (booking) =>
                booking.status === "CONFIRMED" &&
                booking.scheduleId.toString() === scheduleId
        );

        if (alreadyBooked) {
            throw new HttpError(409, "Ya tenés una reserva para este horario.");
        }

        // Paso atómico: si dos personas reservan a la vez, solo una lo consigue.
        const reserved = await this.scheduleRepository.reserveIfAvailable(scheduleId);

        if (!reserved) {
            throw new HttpError(409, "Este horario ya está reservado.");
        }

        try {
            return await this.bookingRepository.create({
                userId: bookingData.userId,
                scheduleId: bookingData.scheduleId,
                status: "CONFIRMED"
            });
        } catch (error) {
            // Si no se pudo guardar la reserva, el horario vuelve a quedar libre.
            await this.scheduleRepository.update(scheduleId, {
                status: "AVAILABLE"
            });

            throw error;
        }
    }

    public async getAllBookings(): Promise<IBooking[]> {
        return await this.bookingRepository.findAll();
    }

    public async getBookingById(
        id: string
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new HttpError(404, "La reserva no existe.");
        }

        return booking;
    }

    public async getBookingsByUserId(
        userId: string
    ): Promise<IBooking[]> {
        return await this.bookingRepository.findByUserId(userId);
    }

    public async updateBooking(
        id: string,
        bookingData: Partial<IBooking>
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new HttpError(404, "La reserva no existe.");
        }

        if (bookingData.userId && bookingData.userId.toString() !== booking.userId.toString()) {
            throw new HttpError(400, "No se puede cambiar el usuario de una reserva.");
        }

        if (bookingData.scheduleId && bookingData.scheduleId.toString() !== booking.scheduleId.toString()) {
            throw new HttpError(400, "No se puede cambiar el horario de una reserva.");
        }

        // El estado lo maneja el sistema: se confirma al reservar y se cancela con DELETE.
        // Si se pudiera editar acá, el horario y la reserva quedarían desincronizados.
        if (bookingData.status !== undefined && bookingData.status !== booking.status) {
            throw new HttpError(
                400,
                "El estado de una reserva no se puede modificar. Para cancelarla, usá la opción de cancelar."
            );
        }

        return booking;
    }

    public async deleteBooking(
        id: string
    ): Promise<IBooking | null> {

        const booking = await this.bookingRepository.findById(id);

        if (!booking) {
            throw new HttpError(404, "La reserva no existe.");
        }

        if (booking.status === "CANCELLED") {
            throw new HttpError(409, "Esta reserva ya está cancelada.");
        }

        const updatedBooking = await this.bookingRepository.update(
            id,
            {
                status: "CANCELLED"
            }
        );

        await this.scheduleRepository.update(
            booking.scheduleId.toString(),
            {
                status: "AVAILABLE"
            }
        );

        return updatedBooking;
    }
}
