/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import bcrypt from 'bcrypt';

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

interface RegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role?: 'admin' | 'seller' | 'buyer';
    avatar?: string;
    address?: {
        city: string;
        district: string;
        fullAddress: string;
    };
}

const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            role = 'buyer',
            avatar,
            address
        } = req.body;

        // Input validation
        if (!firstName || !lastName || !email || !password || !phone) {
            res.status(400).json({
                code: '400',
                message: "All required fields must be provided",
                status: 'error',
                required: ['firstName', 'lastName', 'email', 'password', 'phone']
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

        // Phone format validation
        const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            res.status(400).json({
                code: '400',
                message: "Please provide a valid phone number",
                status: 'error'
            });
            return;
        }

        // Password strength validation
        if (password.length < 6) {
            res.status(400).json({
                code: '400',
                message: "Password must be at least 6 characters long",
                status: 'error'
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase().trim() }, { phone: phone.trim() }] 
        });

        if (existingUser) {
            const conflictField = existingUser.email === email.toLowerCase().trim() ? 'email' : 'phone';
            res.status(409).json({
                code: '409',
                message: `User with this ${conflictField} already exists`,
                status: 'error'
            });
            return;
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone: phone.trim(),
            role,
            avatar: avatar?.trim(),
            address: address ? {
                city: address.city?.trim(),
                district: address.district?.trim(),
                fullAddress: address.fullAddress?.trim()
            } : undefined
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Create response without password
        const userResponse = {
            _id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            phone: savedUser.phone,
            role: savedUser.role,
            isActive: savedUser.isActive,
            avatar: savedUser.avatar,
            address: savedUser.address,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        };

        res.status(201).json({
            code: '201',
            message: "User registered successfully",
            status: 'success',
            data: {
                user: userResponse
            },
            timestamp: new Date().toISOString()
        });

        logger.info(`New user registered: ${email}`);

    } catch (error) {
        // Handle Mongoose validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            const validationErrors = (error as any).errors;
            const errorMessages: { [key: string]: string } = {};
            
            for (const field in validationErrors) {
                errorMessages[field] = validationErrors[field].message;
            }
            
            res.status(400).json({
                code: '400',
                message: "Validation error",
                status: 'error',
                errors: errorMessages
            });
            return;
        }

        // Handle duplicate key errors (MongoDB)
        if (error instanceof Error && (error as any).code === 11000) {
            const duplicateField = Object.keys((error as any).keyValue)[0];
            res.status(409).json({
                code: '409',
                message: `User with this ${duplicateField} already exists`,
                status: 'error'
            });
            return;
        }

        // Handle other errors
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in register endpoint: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

export default register;