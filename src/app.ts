import express from "express";
import dotenv from "dotenv"
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserRoutes } from "./routes/user.routes";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { AuthRoutes } from "./routes/auth.routes";

dotenv.config()
const PORT = process.env.PORT || 3001;

export class App {
    
    public readonly app;

    constructor() {

        this.app = express(); //Para manejar peticiones HTTP
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true })); //Lee formularios HTML

        const userRepository =
            new UserRepository();

        const userService =
            new UserService(userRepository);

        const userController =
            new UserController(userService);

        const userRoutes =
            new UserRoutes(userController);

        const authService =
            new AuthService(userRepository);

        const authController =
            new AuthController(authService);

        const authRoutes =
            new AuthRoutes(authController);

        this.app.use(
            "/api",
            userRoutes.router
        );

        this.app.use(
            "/auth",
            authRoutes.router
        );
    }

    public start(): void {
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}