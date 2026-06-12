import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    public createUser = async (req: Request, res: Response) => {

        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);

        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    };

    public getUsers = async (req: Request, res: Response) => {

        const users = await this.userService.getUsers();
        res.status(200).json(users);
    };

    public getUserById = async (req: Request, res: Response) => {

        const user =
            await this.userService.getUserById(
                req.params.id as string
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    };

    public deleteUser = async (req: Request, res: Response) => {

        const user =
            await this.userService.deleteUser(
                req.params.id as string
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted"
        });
    };

    public updateUser = async (req: Request, res: Response) => {

        try {

            const user = await this.userService.updateUser(req.params.id as string, req.body);

            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            res.status(200).json(user);

        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    };
}