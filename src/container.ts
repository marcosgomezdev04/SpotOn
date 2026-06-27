import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserRoutes } from "./routes/user.routes";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthRoutes } from "./routes/auth.routes";
import { ScheduleRepository } from "./repositories/schedule.repository";
import { BookingRepository } from "./repositories/booking.repository";
import { BookingService } from "./services/booking.service";
import { BookingController } from "./controllers/booking.controller";
import { BookingRoutes } from "./routes/booking.routes";
import { ScheduleService } from "./services/schedule.service";
import { ScheduleController } from "./controllers/schedule.controller";
import { ScheduleRoutes } from "./routes/schedule.routes";

export function createDependencies() {

    const userRepository = new UserRepository();

    const userService = new UserService(userRepository);

    const userController = new UserController(userService);

    const userRoutes = new UserRoutes(userController);

    const authService = new AuthService(userRepository);

    const authController = new AuthController(authService);
    
    const authRoutes = new AuthRoutes(authController);

    const scheduleRepository = new ScheduleRepository();

    const scheduleService = new ScheduleService(scheduleRepository);

    const scheduleController = new ScheduleController(scheduleService);

    const scheduleRoutes = new ScheduleRoutes(scheduleController);

    //const bookingRepository = new BookingRepository();

    /*const bookingService = new BookingService(
        bookingRepository,
        scheduleRepository
    );

    const bookingController = new BookingController(bookingService);
    const bookingRoutes = new BookingRoutes(bookingController);

    */

    return {
        userRoutes,
        authRoutes,
        scheduleRoutes,
        //bookingRoutes
    };
}