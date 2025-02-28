import { Request, Response, NextFunction } from 'express';

const protectedRoutes = ['/profile', '/api/profile']

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const requestURL = req.url
    if (protectedRoutes.includes(requestURL)) {
        const loginCookie = req.cookies.auth;
        if (!loginCookie) {
            res.redirect('/login')
        }
    }
    next();
};