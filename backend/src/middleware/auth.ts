import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../utils/types";
import { COOKIES } from "../utils/config";
import { AuthService } from "../services/AuthService";
import { UserRepository } from "../repositories/UserRepository";

const authService = new AuthService(new UserRepository());

/**
 * Base authentication middleware that sets req.auth data
 * but doesn't block unauthorized requests
 */
export const setAuthInfo = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = await authService.authenticateUserBySessionId(req);
  req.auth = auth;
  next();
};

/**
 * Middleware that ensures a user is authenticated
 * and redirects to login page if not
 */
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // First set the auth info
  setAuthInfo(req, res, () => {
    // Then check if user is authenticated
    if (!req.auth?.isAuthenticated) {
      return res.redirect(302, "/login");
    }
    next();
  });
};

/**
 * Middleware for API routes that returns 401 instead of redirecting
 */
export const requireApiAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  setAuthInfo(req, res, () => {
    if (!req.auth?.isAuthenticated) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    next();
  });
};

/**
 * Gets the session ID from cookies
 */
export const getAndValidateSessionIdFromCookie = (
  req: Request
): string | undefined => {
  const sessionId = req.cookies[COOKIES.SESSION_ID];
  if (!sessionId || typeof sessionId !== "string") {
    return undefined;
  }
  return sessionId;
};
