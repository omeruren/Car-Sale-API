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

const profile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                code: '401',
                message: "Authentication required",
                status: 'error'
            });
            return;
        }

        res.status(200).json({
            code: '200',
            message: "Profile retrieved successfully",
            status: 'success',
            data: {
                user: req.user.userData
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in profile endpoint: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

export default profile;