import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRoutes {

    public readonly router: Router;

    constructor(
        private readonly userController: UserController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        this.router.post(
            "/users",
            this.userController.createUser
        );

        this.router.get(
            "/users",
            this.userController.getUsers
        );

        this.router.get(
            "/users/:id",
            this.userController.getUserById
        );

        this.router.delete(
            "/users/:id",
            this.userController.deleteUser
        );

        this.router.put(
            "/users/:id",
            this.userController.updateUser
        );
    }
}