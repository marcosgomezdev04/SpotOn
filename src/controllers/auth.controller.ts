import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    public register = async (req: Request, res: Response) => {

        const user =
            await this.authService.register(
                req.body.name,
                req.body.email,
                req.body.password
            );

        res.status(201).json(user);
    };

    public login = async (req: Request, res: Response) => {

        const result =
            await this.authService.login(
                req.body.email,
                req.body.password
            );

        res.status(200).json(result);
    };
}