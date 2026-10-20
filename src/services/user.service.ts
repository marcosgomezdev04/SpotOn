import bcrypt from "bcrypt";
import { IUser, UserRole } from "../interfaces/user.interface";
import { HttpError } from "../errors/http-error";
import { IUserRepository } from "../repositories/interface/user.repository.interface";

export interface RequesterContext {
    id: string;
    role: string;
}

const VALID_ROLES: UserRole[] = ["USER", "ADMIN"];

export class UserService {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    public async createUser(
        userData: Partial<IUser>
    ): Promise<IUser> {

        if (
            !userData.name ||
            !userData.email ||
            !userData.password
        ) {
            throw new Error("All fields are required.");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return await this.userRepository.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: "USER"
        });
    }

    public async getUsers(): Promise<IUser[]> {
        return await this.userRepository.findAll();
    }

    public async getUserById(
        id: string
    ): Promise<IUser | null> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        return user;
    }

    public async deleteUser(
        id: string
    ): Promise<IUser | null> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        return await this.userRepository.delete(id);
    }

    public async updateUser(
        id: string,
        userData: Partial<IUser>,
        requester: RequesterContext
    ): Promise<IUser | null> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        // Lista blanca: solo estos campos se pueden modificar desde la API
        const updates: Partial<IUser> = {};

        if (userData.name !== undefined) {
            if (userData.name.trim() === "") {
                throw new Error("Name cannot be empty.");
            }
            updates.name = userData.name;
        }

        if (userData.email !== undefined) {
            if (userData.email.trim() === "") {
                throw new Error("Email cannot be empty.");
            }
            updates.email = userData.email;
        }

        if (userData.password !== undefined) {
            if (userData.password.trim() === "") {
                throw new Error("Password cannot be empty.");
            }
            // Nunca guardar la contraseña en texto plano
            updates.password = await bcrypt.hash(userData.password, 10);
        }

        if (userData.role !== undefined) {
            // Solo un ADMIN puede cambiar roles (evita auto-promoción a ADMIN)
            if (requester.role !== "ADMIN") {
                throw new HttpError(403, "Only admins can change roles.");
            }

            if (!VALID_ROLES.includes(userData.role)) {
                throw new Error("Invalid role.");
            }

            updates.role = userData.role;
        }

        return await this.userRepository.update(id, updates);
    }
}
