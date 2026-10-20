import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    public register = async (req: Request, res: Response) => {

        const { name, email, password } = req.body ?? {};

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        try {
            const user =
                await this.authService.register(name, email, password);

            res.status(201).json(user);

        } catch (error: any) {
            const status = error.message === "Email already exists" ? 409 : 400;
            res.status(status).json({ message: error.message });
        }
    };

    public login = async (req: Request, res: Response) => {

        const { email, password } = req.body ?? {};

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        try {
            const result =
                await this.authService.login(email, password);

            res.status(200).json(result);

        } catch (error: any) {
            // "Invalid credentials" e "Invalid password" responden igual:
            // no se revela si el email existe o no.
            if (String(error.message).startsWith("Invalid")) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.status(500).json({ message: "Internal server error" });
        }
    };
}