import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const requestURL = req.url
    if (requestURL.includes('/profile') || 
        requestURL.includes('/styles/profile') || 
        requestURL.includes('/api/profile')) {
        const loginCookie = req.cookies.login;
        if (!loginCookie) {
            return res.status(401).json({ 
                success: false,
                message: 'Please login to access profile' 
            });
        }
    }
    next();
};