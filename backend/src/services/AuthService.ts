import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { COOKIES } from "../utils/config";
import { Auth, Session, User, UserRegister } from "../utils/types";
import { IAuthService } from "./IAuthService";
import * as argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { Request } from "express";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async authenticateUserByEmailAndPassword(
    email: string,
    password: string
  ): Promise<Auth> {
    const authInfo: Auth = {
      isAuthenticated: false,
      user: undefined,
      sessionID: undefined,
    };
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      const isPasswordValid = await this.verifyPasswordAsync(
        password,
        user.password
      );
      if (isPasswordValid) {
        console.log("password is valid");
        const sessionId = await this.createSession(user.id);
        if (!sessionId) {
          //i dont know if this happens or not :D:D:D:D:D:D
          throw new Error("Failed to create session");
        }
        console.log("sessionId created in auth service", sessionId);
        authInfo.isAuthenticated = true;
        authInfo.user = {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
        };
        authInfo.sessionID = sessionId;
        console.log("authInfo created in auth service", authInfo);
        return authInfo;
      }
    }
    return authInfo;
  }

  async hashPasswordAsync(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verifyPasswordAsync(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = this.createSessionID();
    const session: Session = {
      id: sessionId,
      userId,
      createdAt: new Date().toISOString(),
      //TODO : get the expiration time from the config
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const savedSessionId = await this.userRepository.saveSession(session);
    return savedSessionId;
  }

  createSessionID(): string {
    return uuidv4();
  }

  createUserID(): string {
    return uuidv4();
  }

  async createUser(user: UserRegister): Promise<User | undefined> {
    //TODO : validate user data
    const userExists = await this.userRepository.exists(user.email);
    if (userExists) {
      return undefined;
    }
    const userToSave: User = {
      id: this.createUserID(),
      fullname: user.fullname,
      email: user.email,
      password: await this.hashPasswordAsync(user.password),
    };
    return this.userRepository.save(userToSave);
  }

  async authenticateUserBySessionId(req: Request): Promise<Auth> {
    const sessionId = this.getSessionIDFromCookie(req);
    if (!sessionId) {
      return {
        isAuthenticated: false,
        user: undefined,
        sessionID: undefined,
      };
    }
    const session = await this.userRepository.findSessionById(sessionId);
    if (!session) {
      return {
        isAuthenticated: false,
        user: undefined,
        sessionID: undefined,
      };
    }
    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      return {
        isAuthenticated: false,
        user: undefined,
        sessionID: undefined,
      };
    }
    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      },
    };
  }
  getSessionIDFromCookie(req: Request): string | undefined {
    const sessionId = req.cookies[COOKIES.SESSION_ID];
    if (!sessionId || typeof sessionId !== "string") {
      return undefined;
    }
    return sessionId;
  }
}
