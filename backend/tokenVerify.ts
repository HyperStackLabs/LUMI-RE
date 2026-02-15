import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. We extend the standard Express Request to allow a 'user' property
// This fixes TypeScript errors when you try to access req.user
export interface AuthRequest extends Request {
    user?: any; 
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 2. Grab the token from the cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access Denied. You are not logged in." });
    }

    try {
        // 3. Verify the token using the secret in your .env
        const verified = jwt.verify(token, process.env.JWT_TOKEN as string);

        // 4. CRITICAL FIX: Attach the user to THIS SPECIFIC REQUEST.
        // We do NOT use a global variable. This user data lives only for this request.
        req.user = verified;

        // 5. Allow the request to proceed to the next step (the route handler)
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};