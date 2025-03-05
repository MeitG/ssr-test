import express from "express";
import { saveContactToFile, deleteSession } from "../utils/fileStorage";
import dotenv from "dotenv";
import { AuthRequest, UserRegister } from "../utils/types";
import { requireApiAuth } from "../middleware/auth";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";
import { COOKIES } from "../utils/config";

// Load environment variables
dotenv.config();

const router = express.Router();

const authService = new AuthService(new UserRepository());

// Define routes with their respective handlers

//routes that require authentication
router.get("/profile", requireApiAuth, handleGetProfile);
router.post("/logout", requireApiAuth, handleLogout);

//routes that do not require authentication
router.post("/contact", handleContactSubmission);
router.post("/register", handleUserRegister);
router.post("/login", handleLogin);
router.get("/check-auth", handleCheckAuth);

// Contact form handler function
async function handleContactSubmission(
  req: express.Request,
  res: express.Response
) {
  console.log("📨 Contact form submission received");
  console.log("Request body:", req.body);

  try {
    const contact = req.body;

    // Validate required fields
    if (
      !contact.name ||
      !contact.email ||
      !contact.subject ||
      !contact.message
    ) {
      console.log("❌ Validation failed: Missing required fields");
      console.log("Received:", contact);

      return res.status(400).json({
        success: false,
        message:
          "Missing required fields. Please provide name, email, subject, and message.",
      });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      console.log("❌ Validation failed: Invalid email format", contact.email);

      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Process the contact form data
    console.log("✅ Contact form data validated successfully");

    // Save to JSON file
    try {
      const savedContact = await saveContactToFile(contact);
      console.log(`Contact saved to file with ID: ${savedContact.id}`);
    } catch (fileError) {
      console.error("Error saving to file:", fileError);
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while saving your message. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "Thank you! Your message has been received.",
    });
  } catch (error) {
    console.error("❌ Error processing contact submission:", error);

    res.status(500).json({
      success: false,
      message:
        "An error occurred while processing your submission. Please try again later.",
    });
  }
}

// User creation handler function
async function handleUserRegister(req: express.Request, res: express.Response) {
  const email = req.body.email;
  const fullname = req.body.fullname;
  const password = req.body.password;
  const userToRegister: UserRegister = {
    email,
    fullname,
    password,
  };
  //TODO : i will implement error handling and data validation later :D)
  try {
    const user = await authService.createUser(userToRegister);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    console.log(`User created with ID: ${user.id}`);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while creating your account. Please try again later.",
    });
  }
}

// Login handler function
async function handleLogin(req: express.Request, res: express.Response) {
  //TODO : i will implement error handling and data validation later :D)
  console.log("📨 Login form submission received");
  console.log("Request body:", req.body);
  const userData = req.body;
  try {
    const authInfo = await authService.authenticateUserByEmailAndPassword(
      userData.email,
      userData.password
    );
    if (authInfo.isAuthenticated) {
      res
        .status(200)
        .cookie(COOKIES.SESSION_ID, authInfo.sessionID, { httpOnly: true })
        .json({
          success: true,
          message: "Login successful",
          user: authInfo.user,
          sessionID: authInfo.sessionID,
        });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server",
    });
  }
}

// Profile handler function
function handleGetProfile(req: AuthRequest, res: express.Response) {
  //guarantee that the user is authenticated
  const user = req.auth!.user;
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: user,
  });
}

// Logout handler function
function handleLogout(req: AuthRequest, res: express.Response) {
  const sessionId = req.auth!.sessionID!;
  deleteSession(sessionId);
  res.status(200).clearCookie("session_ID").json({
    success: true,
    message: "Logout successful",
  });
}

// Auth check handler function
//boo an miad bala nesbat bala nesbat
async function handleCheckAuth(req: express.Request, res: express.Response) {
  const auth = await authService.authenticateUserBySessionId(req);
  if (!auth.isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "unauthorized",
    });
  }
  res.status(200).json({
    success: true,
    message: "authorized",
    user: auth.user,
  });
}

export default router;
