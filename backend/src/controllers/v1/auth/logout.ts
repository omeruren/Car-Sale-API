/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Custom Modules
 */
import { logger } from "@/lib/winston";

/**
 * Types
 */
import { Request, Response } from "express";

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            code: '200',
            message: "Logged out successfully",
            status: 'success',
            timestamp: new Date().toISOString()
        });

        if (req.user) {
            logger.info(`User logged out: ${req.user.email}`);
        }

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in logout endpoint: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

export default logout;