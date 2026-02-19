import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request{
    user?: any
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction)=> {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message: 'Fuck off.'})
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = decoded
        next()
    }catch(error){
        return res.status(403).json({message: 'Wrong Token, pal.'})
    }
}