import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const CONTACTS_FILE = path.join(__dirname, '..', 'contacts.json');

// Contact data type
interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
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
    console.error('Error initializing contacts file:', error);
    return [];
  }
};

// Save contact to JSON file
export const saveContactToFile = async (contactData: any): Promise<Contact> => {
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