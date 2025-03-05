import { Auth, User, UserRegister } from "../utils/types";
import { Request } from "express";
export interface IAuthService {
  authenticateUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<Auth>;
  hashPasswordAsync(password: string): Promise<string>;
  verifyPasswordAsync(
    password: string,
    hashedPassword: string
  ): Promise<boolean>;
  createSession(userId: string): Promise<string>;
  createSessionID(): string;
  createUser(user: UserRegister): Promise<User | undefined>;
  createUserID(): string;
  authenticateUserBySessionId(req: Request): Promise<Auth>;
  getSessionIDFromCookie(req: Request): string | undefined;
}
