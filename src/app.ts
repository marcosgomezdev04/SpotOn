import express from "express";
import dotenv from "dotenv"
import { createDependencies } from "./container";

dotenv.config()
const PORT = process.env.PORT || 3001;

export class App {
    
    public readonly app;

    constructor() {

        this.app = express(); //Para manejar peticiones HTTP
        this.app.use(express.json()); //Permite que express interprete automaticamente JSON

        const { userRoutes, authRoutes, bookingRoutes } = createDependencies();

        this.app.use(
            "/api",
            userRoutes.router
        );

        this.app.use(
            "/api",
            bookingRoutes.router
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