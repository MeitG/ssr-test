import express from 'express';
import { saveContactToFile, saveUserToFile, isUserExists, getUserByEmail } from '../utils/fileStorage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Contact form submission handler
router.post('/contact', async (req, res) => {
  console.log('📨 Contact form submission received');
  console.log('Request body:', req.body);
  
  try {
    const contact = req.body;
    
    // Validate required fields
    if (!contact.name || !contact.email || !contact.subject || !contact.message) {
      console.log('❌ Validation failed: Missing required fields');
      console.log('Received:', contact);
      
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields. Please provide name, email, subject, and message.' 
      });
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      console.log('❌ Validation failed: Invalid email format', contact.email);
      
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address.' 
      });
    }
    
    // Process the contact form data
    console.log('✅ Contact form data validated successfully');
    
    // Save to JSON file
    try {
      const savedContact = await saveContactToFile(contact);
      console.log(`Contact saved to file with ID: ${savedContact.id}`);
    } catch (fileError) {
      console.error('Error saving to file:', fileError);
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred while saving your message. Please try again later.' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Thank you! Your message has been received.' 
    });
  } catch (error) {
    console.error('❌ Error processing contact submission:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your submission. Please try again later.' 
    });
  }
});

router.post('/user', async (req, res) => {
  console.log('📨 User form submission received');
  console.log('Request body:', req.body);
  const user = req.body;
  // Validate required fields
  if (!user.fullname || !user.email || !user.password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields. Please provide fullname, email, and password.' 
    });
  }

  try {
    // Check if user already exists
    if (isUserExists(user.email)) {
      return res.status(409).json({ 
        success: false, 
        message: 'A user with this email already exists.' 
      });
    }
    
    const savedUser = await saveUserToFile(user);
    console.log(`User saved to file with ID: ${savedUser.id}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      userId: savedUser.id
    });
  } catch (error) {
    console.error('Error saving to file:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating your account. Please try again later.' 
    });
  }
});

//Login route

router.post('/login', async (req, res) => {
  console.log('📨 Login form submission received');
  console.log('Request body:', req.body);
  const userData = req.body;
  // Validate required fields
  if (!userData.email || !userData.password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields. Please provide email and password.' 
    });
  }

  try {
    const normalizedEmail = userData.email.toLowerCase().trim();
    const user = getUserByEmail(normalizedEmail);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    if (user.password !== userData.password) {  
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      fullname: user.fullname
    };


    res.status(200).cookie("login" , "ahsannt").json({ 
      success: true, 
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Error saving to file:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while logging in. Please try again later.' 
    });
  }
});
  


// Add more API routes as needed
// router.get('/users', ...);
// router.post('/auth', ...);

export default router; 