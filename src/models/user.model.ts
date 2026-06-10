import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface"

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = model<IUser>("User", UserSchema);