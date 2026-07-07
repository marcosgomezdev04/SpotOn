import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware, requireAdmin, requireOwnerOrAdmin } from "../middlewares/auth.middleware";

export class UserRoutes {

    public readonly router: Router;

    constructor(
        private readonly userController: UserController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {

        this.router.get(
            "/getAll",
            authMiddleware,
            requireAdmin,
            this.userController.getUsers
        );

        this.router.get(
            "/getById/:id",
            authMiddleware,
            requireOwnerOrAdmin,
            this.userController.getUserById
        );

        this.router.delete(
            "/delete/:id",
            authMiddleware,
            requireOwnerOrAdmin,
            this.userController.deleteUser
        );

        this.router.put(
            "/update/:id",
            authMiddleware,
            requireOwnerOrAdmin,
            this.userController.updateUser
        );
    }
}