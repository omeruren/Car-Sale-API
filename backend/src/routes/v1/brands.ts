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
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "@/controllers/v1/brands";

/**
 * Middlewares
 */
import { authenticateToken, requireRole } from "@/middlewares/auth";

const router = Router();

// Public routes
router.get('/', getBrands);
router.get('/:id', getBrandById);

// Protected routes - Admin only
router.post('/', authenticateToken, requireRole(['admin']), createBrand);
router.put('/:id', authenticateToken, requireRole(['admin']), updateBrand);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteBrand);

export default router;