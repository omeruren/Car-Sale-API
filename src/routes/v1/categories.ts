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
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from "@/controllers/v1/categories";

/**
 * Middlewares
 */
import { authenticateToken, requireRole } from "@/middlewares/auth";

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes - Admin only
router.post('/', authenticateToken, requireRole(['admin']), createCategory);
router.put('/:id', authenticateToken, requireRole(['admin']), updateCategory);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteCategory);

export default router;