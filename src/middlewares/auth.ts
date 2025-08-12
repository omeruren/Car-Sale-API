/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import jwt from 'jsonwebtoken';

/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import { User } from '@/models/user';

/**
 * Types
 */
import { Request, Response, NextFunction } from "express";

interface JWTPayload {
    userId: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer';
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: 'admin' | 'seller' | 'buyer';
                userData?: any;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            res.status(401).json({
                code: '401',
                message: "Access token required",
                status: 'error'
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
        
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        
        // Optional: Verify user still exists and is active
        const user = await User.findById(decoded.userId).select('-password');
        if (!user || !user.isActive) {
            res.status(401).json({
                code: '401',
                message: "Invalid or expired token",
                status: 'error'
            });
            return;
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            userData: user
        };

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                code: '401',
                message: "Invalid token",
                status: 'error'
            });
            return;
        }

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                code: '401',
                message: "Token expired",
                status: 'error'
            });
            return;
        }

        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error'
        });

        logger.error(`Error in auth middleware: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

export const requireRole = (roles: ('admin' | 'seller' | 'buyer')[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                code: '401',
                message: "Authentication required",
                status: 'error'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                code: '403',
                message: "Insufficient permissions",
                status: 'error',
                required: roles
            });
            return;
        }

        next();
    };
};