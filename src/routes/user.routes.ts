import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, requireAdmin } from "../middlewares/auth.middleware";

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
            authMiddleware,
            requireAdmin,
            this.userController.getUsers
        );

        this.router.get(
            "/getById/:id",
            authMiddleware,
            this.userController.getUserById
        );

        this.router.delete(
            "/delete/:id",
            authMiddleware,
            requireAdmin,
            this.userController.deleteUser
        );

        this.router.put(
            "/update/:id",
            authMiddleware,
            this.userController.updateUser
        );
    }
}