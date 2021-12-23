import { Role } from "../models/role.model";

export interface AuthData {
    email: string,
    password: string,
    role: Role
}