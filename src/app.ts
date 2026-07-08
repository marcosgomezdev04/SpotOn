import express from "express";
import dotenv from "dotenv";
import { createDependencies } from "./container";

dotenv.config();
const PORT = process.env.PORT || 3001;

export class App {
    
    public readonly app;

    constructor() {

        this.app = express(); // Para manejar peticiones HTTP
        this.app.use(express.json()); // Permite que Express interprete JSON

        const { userRoutes, authRoutes, scheduleRoutes, /*bookingRoutes*/} = createDependencies();

        this.app.use(
            "/user",
            userRoutes.router
        );

        this.app.use(
            "/auth",
            authRoutes.router
        );        

        this.app.use(
            "/schedule",
            scheduleRoutes.router
        );

        /*this.app.use(
            "/booking",
            bookingRoutes.router
        );
        */
    }

    public start(): void {
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}