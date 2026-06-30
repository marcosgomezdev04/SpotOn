import { IUser } from "../../interfaces/user.interface";

export interface IUserRepository {
    
    create(userData: Partial<IUser>): Promise<IUser>;

    findAll(): Promise<IUser[]>;

    findById(id: string): Promise<IUser | null>;

    findByEmail(email: string): Promise<IUser | null>;

    update(
        id: string,
        userData: Partial<IUser>
    ): Promise<IUser | null>;

    delete(id: string): Promise<IUser | null>;
}