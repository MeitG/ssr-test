import path from "path";

// Define the data storage directory path
export const DATA_STORAGE_DIR = path.join(__dirname, "..", "..", "dataStorage");

// Define file paths for different data types
export const FILE_PATHS = {
  CONTACTS_FILE: path.join(DATA_STORAGE_DIR, "contacts.json"),
  USERS_FILE: path.join(DATA_STORAGE_DIR, "users.json"),
  SESSIONS_FILE: path.join(DATA_STORAGE_DIR, "sessions.json"),
};

// Cookie configuration
export const COOKIES = {
  SESSION_ID: "session_ID",
};
