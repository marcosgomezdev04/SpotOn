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
            select: false, // no se devuelve en las consultas salvo que se pida con +password
        },
        role: {
            type: String,
            required: true,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    {
        timestamps: true,
        toJSON: {
            // Nunca serializar el hash en las respuestas de la API
            transform: (_doc: unknown, ret: any) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const UserModel = model<IUser>("User", UserSchema);