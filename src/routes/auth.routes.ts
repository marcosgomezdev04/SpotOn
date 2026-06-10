import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export class AuthRoutes {

    public readonly router: Router;

    constructor(
        private readonly authController: AuthController
    ) {

        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        this.router.post(
            "/register",
            this.authController.register
        );

        this.router.post(
            "/login",
            this.authController.login
        );
    }
}