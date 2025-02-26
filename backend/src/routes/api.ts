import express from 'express';
import { saveContactToFile } from '../utils/fileStorage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Contact form submission handler
router.post('/contact', async (req, res) => {
  console.log('📨 Contact form submission received');
  console.log('Request body:', req.body);
  
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Validation failed: Missing required fields');
      console.log('Received:', { name, email, subject, message });
      
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields. Please provide name, email, subject, and message.' 
      });
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: Invalid email format', email);
      
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address.' 
      });
    }
    
    // Process the contact form data
    console.log('✅ Contact form data validated successfully');
    
    // Save to JSON file
    try {
      const savedContact = await saveContactToFile({ name, email, subject, message });
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

// Add more API routes as needed
// router.get('/users', ...);
// router.post('/auth', ...);

export default router; 