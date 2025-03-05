import { User, Session } from "../../utils/types";

export interface IUserRepository {
  // User methods
  save(userData: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  exists(email: string): Promise<boolean>;

  // Session methods (as part of User aggregate)
  saveSession(session: Session): Promise<string>;
  findSessionById(sessionId: string): Promise<Session | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  getUserBySessionId(sessionId: string): Promise<User | undefined>;
}
