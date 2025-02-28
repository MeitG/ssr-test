import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const CONTACTS_FILE = path.join(__dirname, '..', 'contacts.json');
const USERS_FILE = path.join(__dirname, '..', 'users.json');
// Contact data type
interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
}
// Initialize contacts file if it doesn't exist
const initContactsFile = (): Contact[] => {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) {
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
      console.log('Created new contacts.json file');
      return [];
    }
    
    const fileContent = fs.readFileSync(CONTACTS_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    //TODO : better Error Handling
    console.error('Error initializing contacts file:', error);
    throw error;
  }
};

const initUsersFile = (): User[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
      console.log('Created new users.json file');
      return [];
    }
    
    const fileContent = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    //TODO : better Error Handling
    console.error('Error initializing users file:', error);
    throw new Error('Error initializing users file');
  }
};

// Save contact to JSON file
export const saveContactToFile = async (contactData: Contact): Promise<Contact> => {
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
      timestamp: new Date().toISOString()
    };
    
    // Add new contact to array
    contacts.push(newContact);
    
    // Write updated contacts back to file
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    
    console.log('✅ Contact saved to JSON file successfully');
    console.log('Contact ID:', newContact.id);
    
    return newContact;
  } catch (error) {
    console.error('❌ Error saving contact to file:', error);
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
      password: userData.password
    };
    
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('✅ User saved to JSON file successfully');
    console.log('User ID:', newUser.id);
    return newUser;
  } catch (error) {
    //TODO : better Error Handling
    console.error('❌ Error saving user to file:', error);
    throw new Error('Error saving user to file');
  }
};

export const isUserExists = (email: string): boolean => {
  const users: User[] = initUsersFile();
  return users.some(user => user.email === email);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users: User[] = initUsersFile();
  return users.find(user => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  const users: User[] = initUsersFile();
  return users.find(user => user.id === id);
};