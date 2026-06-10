import { IUser } from "../interfaces/user.interface"
import { UserModel } from "../models/user.model";
import { IUserRepository } from "./interface/user.repository.interface";

export class UserRepository implements IUserRepository {

    public async create(
        userData: Partial<IUser>
    ): Promise<IUser> {
        return await UserModel.create(userData);
    }

    public async findAll(): Promise<IUser[]> {
        return await UserModel.find();
    }

    public async findById(
        id: string
    ): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    public async findByEmail(
        email: string
    ): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    public async update(
        id: string,
        userData: Partial<IUser>
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(
            id,
            userData,
            {
                new: true
            }
        );
    }

    public async delete(
        id: string
    ): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(id);
    }
}