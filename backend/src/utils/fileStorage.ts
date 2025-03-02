import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Contact, User, Session } from "./types";
import { DATA_STORAGE_DIR, FILE_PATHS } from "./config";

// Ensure data storage directory exists
const ensureDataStorageDir = () => {
  if (!fs.existsSync(DATA_STORAGE_DIR)) {
    fs.mkdirSync(DATA_STORAGE_DIR, { recursive: true });
    console.log(`Created data storage directory at ${DATA_STORAGE_DIR}`);
  }
};

// Initialize contacts file if it doesn't exist
const initContactsFile = (): Contact[] => {
  try {
    ensureDataStorageDir();

    if (!fs.existsSync(FILE_PATHS.CONTACTS_FILE)) {
      fs.writeFileSync(FILE_PATHS.CONTACTS_FILE, JSON.stringify([], null, 2));
      console.log("Created new contacts.json file");
      return [];
    }

    const fileContent = fs.readFileSync(FILE_PATHS.CONTACTS_FILE, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    //TODO : better Error Handling
    console.error("Error initializing contacts file:", error);
    throw error;
  }
};

const initUsersFile = (): User[] => {
  try {
    ensureDataStorageDir();

    if (!fs.existsSync(FILE_PATHS.USERS_FILE)) {
      fs.writeFileSync(FILE_PATHS.USERS_FILE, JSON.stringify([], null, 2));
      console.log("Created new users.json file");
      return [];
    }

    const fileContent = fs.readFileSync(FILE_PATHS.USERS_FILE, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    //TODO : better Error Handling
    console.error("Error initializing users file:", error);
    throw new Error("Error initializing users file");
  }
};

const initSessionsFile = (): Session[] => {
  try {
    ensureDataStorageDir();

    if (!fs.existsSync(FILE_PATHS.SESSIONS_FILE)) {
      fs.writeFileSync(FILE_PATHS.SESSIONS_FILE, JSON.stringify([], null, 2));
      console.log("Created new sessions.json file");
      return [];
    }

    const fileContent = fs.readFileSync(FILE_PATHS.SESSIONS_FILE, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    //TODO : better Error Handling
    console.error("Error initializing sessions file:", error);
    throw new Error("Error initializing sessions file");
  }
};

// Save contact to JSON file
export const saveContactToFile = async (
  contactData: Contact
): Promise<Contact> => {
  try {
    // Read existing contacts
    const contacts: Contact[] = initContactsFile();

    // Create new contact with unique ID
    const newContact: Contact = {
      id: uuidv4(),
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      timestamp: new Date().toISOString(),
    };

    // Add new contact to array
    contacts.push(newContact);

    // Write updated contacts back to file
    fs.writeFileSync(
      FILE_PATHS.CONTACTS_FILE,
      JSON.stringify(contacts, null, 2)
    );

    console.log("✅ Contact saved to JSON file successfully");
    console.log("Contact ID:", newContact.id);

    return newContact;
  } catch (error) {
    console.error("❌ Error saving contact to file:", error);
    throw error;
  }
};

export const saveUserToFile = async (userData: User): Promise<User> => {
  try {
    const users: User[] = initUsersFile();
    const newUser: User = {
      id: uuidv4(),
      fullname: userData.fullname,
      email: userData.email,
      password: userData.password,
    };

    users.push(newUser);
    fs.writeFileSync(FILE_PATHS.USERS_FILE, JSON.stringify(users, null, 2));
    console.log("✅ User saved to JSON file successfully");
    console.log("User ID:", newUser.id);
    return newUser;
  } catch (error) {
    //TODO : better Error Handling
    console.error("❌ Error saving user to file:", error);
    throw new Error("Error saving user to file");
  }
};

export const isUserExists = (email: string): boolean => {
  const users: User[] = initUsersFile();
  return users.some((user) => user.email === email);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users: User[] = initUsersFile();
  return users.find((user) => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  const users: User[] = initUsersFile();
  return users.find((user) => user.id === id);
};

export const saveSession = (userSession: Session): string => {
  try {
    const sessions: Session[] = initSessionsFile();
    sessions.push(userSession);
    fs.writeFileSync(
      FILE_PATHS.SESSIONS_FILE,
      JSON.stringify(sessions, null, 2)
    );
    console.log("✅ Session saved successfully");
    return userSession.id;
  } catch (error) {
    //TODO : better Error Handling
    console.error("❌ Error saving session to file:", error);
    throw new Error("Error saving session to file");
  }
};

export const getSession = (sessionId: string): Session | undefined => {
  const sessions: Session[] = initSessionsFile();
  return sessions.find((session) => session.id === sessionId);
};

export const deleteSession = (sessionId: string): void => {
  const sessions: Session[] = initSessionsFile();
  const index = sessions.findIndex((session) => session.id === sessionId);
  if (index !== -1) {
    sessions.splice(index, 1);
    fs.writeFileSync(
      FILE_PATHS.SESSIONS_FILE,
      JSON.stringify(sessions, null, 2)
    );
  }
};
