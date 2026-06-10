import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../repositories/interface/user.repository.interface";

export class AuthService {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    public async register(
        name: string,
        email: string,
        password: string
    ) {

        const existingUser =
            await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        return await this.userRepository.create({
            name,
            email,
            password: hashedPassword //Password hasheada
        });
    }

    public async login(
        email: string,
        password: string
    ) {

        const user =
            await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isValid) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            {
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1d" //Token expira en 1 dia
            }
        );

        return {token};
    }
}