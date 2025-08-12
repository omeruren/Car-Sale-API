/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";
import config from "@/config";

/**
 * Models
 */
import { User } from '@/models/user';

/**
 * Types
 */
import { Request, Response } from "express";

interface LoginRequestBody {
    email: string;
    password: string;
}

const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            res.status(400).json({
                code: '400',
                message: "Email and password are required",
                status: 'error',
                required: ['email', 'password']
            });
            return;
        }

        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                code: '400',
                message: "Please provide a valid email address",
                status: 'error'
            });
            return;
        }

        // Find user by email
        const user = await User.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if (!user) {
            res.status(401).json({
                code: '401',
                message: "Invalid email or password",
                status: 'error'
            });
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            res.status(403).json({
                code: '403',
                message: "Account is deactivated. Please contact support.",
                status: 'error'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                code: '401',
                message: "Invalid email or password",
                status: 'error'
            });
            return;
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(tokenPayload, jwtSecret, { 
            expiresIn: jwtExpiresIn 
        } as jwt.SignOptions);

        // Generate refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: '7d' }
        );

        // Remove password from user response
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
            avatar: user.avatar,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        // Set HTTP-only cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            code: '200',
            message: "Login successful",
            status: 'success',
            data: {
                user: userResponse,
                token,
                expiresIn: jwtExpiresIn
            },
            timestamp: new Date().toISOString()
        });

        logger.info(`User logged in: ${email}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in login endpoint: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

export default login;