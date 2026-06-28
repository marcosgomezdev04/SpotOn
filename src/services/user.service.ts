import { IUser } from "../interfaces/user.interface";
import { IUserRepository } from "../repositories/interface/user.repository.interface";

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

        return await this.userRepository.create(userData);
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
        userData: Partial<IUser>
    ): Promise<IUser | null> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new Error("User not found.");
        }

        if (userData.name !== undefined && userData.name.trim() === "") {
            throw new Error("Name cannot be empty.");
        }

        if (userData.email !== undefined && userData.email.trim() === "") {
            throw new Error("Email cannot be empty.");
        }

        if (userData.password !== undefined && userData.password.trim() === "") {
            throw new Error("Password cannot be empty.");
        }

        return await this.userRepository.update(id, userData);
    }
}