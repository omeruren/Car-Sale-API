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
import {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from "@/controllers/v1/cars";

/**
 * Middlewares
 */
import { authenticateToken, requireRole } from "@/middlewares/auth";

const router = Router();

// Public routes
router.get('/', getCars);
router.get('/:id', getCarById);

// Protected routes - Sellers and Admin can create/manage cars
router.post('/', authenticateToken, requireRole(['seller', 'admin']), createCar);
router.put('/:id', authenticateToken, requireRole(['seller', 'admin']), updateCar);
router.delete('/:id', authenticateToken, requireRole(['seller', 'admin']), deleteCar);

export default router;