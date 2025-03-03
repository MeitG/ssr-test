import { Response, NextFunction, Request } from "express";
import { getSession, getUserById } from "../utils/fileStorage";
import { AuthRequest } from "../utils/types";
import { COOKIES } from "../utils/config";

/**
 * Base authentication middleware that sets req.auth data
 * but doesn't block unauthorized requests
 */
export const setAuthInfo = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  req.auth = {
    isAuthenticated: false,
    user: undefined,
    sessionID: undefined,
  };

  const sessionId = getAndValidateSessionIdFromCookie(req);
  if (!sessionId) {
    return next();
  }

  const session = getSession(sessionId);
  if (!session) {
    console.log("No session found for sessionId", sessionId);
    return next();
  }

  const user = getUserById(session.userId);
  if (!user) {
    console.log("No user found for session", sessionId);
    return next();
  }

  req.auth = {
    isAuthenticated: true,
    user: { id: user.id, fullname: user.fullname, email: user.email },
    sessionID: sessionId,
  };

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
