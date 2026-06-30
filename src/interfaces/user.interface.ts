export type UserRole = "USER" | "ADMIN";

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}
