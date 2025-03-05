import { v4 as uuidv4 } from "uuid";
import { IUserRepository } from "./interfaces/IUserRepository";
import { User, Session } from "../utils/types";
import { JSONDataStore } from "../persistence/JSONDataStore";

export class UserRepository implements IUserRepository {
  private userStore: JSONDataStore<User>;
  private sessionStore: JSONDataStore<Session>;

  constructor() {
    // Using relative paths since JSONDataStore now joins with DATA_STORAGE_DIR
    this.userStore = new JSONDataStore<User>("users.json");
    this.sessionStore = new JSONDataStore<Session>("sessions.json");
  }

  /**
   * Save a user to the data store
   * @param userData User data to save
   * @returns The saved user with ID
   */
  async save(userData: User): Promise<User> {
    // If no ID is provided, generate one
    if (!userData.id) {
      userData.id = uuidv4();
    }

    // Check if user already exists
    const users = await this.userStore.readAll();
    const existingUserIndex = users.findIndex(
      (user) => user.id === userData.id
    );

    if (existingUserIndex >= 0) {
      // Update existing user
      users[existingUserIndex] = userData;
      await this.userStore.writeAll(users);
    } else {
      // Add new user
      await this.userStore.add(userData);
    }

    return userData;
  }

  /**
   * Find a user by email
   * @param email Email to search for
   * @returns User if found, undefined otherwise
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const users = await this.userStore.readAll();
    return users.find((user) => user.email === email);
  }

  /**
   * Find a user by ID
   * @param id User ID to search for
   * @returns User if found, undefined otherwise
   */
  async findById(id: string): Promise<User | undefined> {
    const users = await this.userStore.readAll();
    return users.find((user) => user.id === id);
  }

  /**
   * Check if a user with the given email exists
   * @param email Email to check
   * @returns True if user exists, false otherwise
   */
  async exists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  /**
   * Create a new session for a user
   * @param userId User ID to create session for
   * @param expiresAt Expiration date string
   * @returns Session ID
   */
  async saveSession(session: Session): Promise<string> {
    //TODO : user repository should not be responsible for creating sessions
    await this.sessionStore.add(session);
    return session.id;
  }

  /**
   * Find a session by ID
   * @param sessionId Session ID to search for
   * @returns Session if found, undefined otherwise
   */
  async findSessionById(sessionId: string): Promise<Session | undefined> {
    const sessions = await this.sessionStore.readAll();
    return sessions.find((session) => session.id === sessionId);
  }

  /**
   * Delete a session
   * @param sessionId Session ID to delete
   */
  async deleteSession(sessionId: string): Promise<void> {
    const sessions = await this.sessionStore.readAll();
    const filteredSessions = sessions.filter(
      (session) => session.id !== sessionId
    );
    await this.sessionStore.writeAll(filteredSessions);
  }

  /**
   * Get a user by session ID
   * @param sessionId Session ID to search for
   * @returns User if found, undefined otherwise
   */
  async getUserBySessionId(sessionId: string): Promise<User | undefined> {
    const session = await this.findSessionById(sessionId);
    if (!session) {
      return undefined;
    }

    return this.findById(session.userId);
  }
}
