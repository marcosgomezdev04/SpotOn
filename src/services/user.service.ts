import { IUser } from "../interfaces/user.interface";
import { IUserRepository } from "../repositories/interface/user.repository.interface";

export class UserService {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    public async createUser(
        userData: Partial<IUser>
    ): Promise<IUser> {

        const existingUser =
            await this.userRepository.findByEmail(
                userData.email! //Not null (!)
            );

        if (existingUser) {
            throw new Error("Email already exists");
        }

        return await this.userRepository.create(
            userData
        );
    }

    public async getUsers(): Promise<IUser[]> {
        return await this.userRepository.findAll();
    }

    public async getUserById(
        id: string
    ): Promise<IUser | null> {
        return await this.userRepository.findById(id);
    }

    public async deleteUser(
        id: string
    ): Promise<IUser | null> {
        return await this.userRepository.delete(id);
    }
}