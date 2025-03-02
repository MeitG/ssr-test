import { Response, NextFunction, Request } from 'express';
import { getSession, getUserById } from '../utils/fileStorage';
import { AuthRequest } from '../utils/types';



export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    
    req.auth = {
        isAuthenticated: false,
        user: undefined,
        sessionID: undefined
    }
    const sessionId = req.cookies.session_ID;
    const session = getSession(sessionId);
    if(session){
        const user = getUserById(session!.userId);
        if(user){
            req.auth = {
                isAuthenticated: true,
                user: {id: user.id, fullname: user.fullname, email: user.email},
                sessionID: sessionId
            }
        }
        else{
            console.log("No user found for session", sessionId);
        }
    }
    else{
        console.log("No session found for sessionId", sessionId);
    }
    // User is authenticated and route is protected, proceed
    next();
};

