import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserRoutes } from "./routes/user.routes";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthRoutes } from "./routes/auth.routes";

export function createDependencies() {

    const userRepository = new UserRepository();

    const userService = new UserService(userRepository);

    const userController = new UserController(userService);

    const userRoutes = new UserRoutes(userController);

    const authService = new AuthService(userRepository);

    const authController = new AuthController(authService);
    
    const authRoutes = new AuthRoutes(authController);

    return {
        userRoutes,
        authRoutes,
    };
}