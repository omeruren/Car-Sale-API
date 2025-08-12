/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import { Router } from "express";

/**
 * Controllers
 */
import registerController from "@/controllers/v1/auth/register";
import loginController from "@/controllers/v1/auth/login";
import logoutController from "@/controllers/v1/auth/logout";
import profileController from "@/controllers/v1/auth/profile";


/**
 * Middlewares
 */
import { authenticateToken } from "@/middlewares/auth";

/**
 * Models
 */

const router = Router();

// Public routes
router.post('/register', registerController);
router.post('/login', loginController);

// Protected routes
router.post('/logout', authenticateToken, logoutController);
router.get('/profile', authenticateToken, profileController);

export default router;