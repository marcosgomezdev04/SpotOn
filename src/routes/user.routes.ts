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
            "/post",
            this.userController.createUser
        );

        this.router.get(
            "/get",
            this.userController.getUsers
        );

        this.router.get(
            "/getById/:id",
            this.userController.getUserById
        );

        this.router.delete(
            "/delete/:id",
            this.userController.deleteUser
        );

        this.router.put(
            "/update/:id",
            this.userController.updateUser
        );
    }
}