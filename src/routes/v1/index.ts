/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */
import { Router } from "express";

const router = Router();

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth';
import brandRoutes from '@/routes/v1/brands';
import categoryRoutes from '@/routes/v1/categories';
import carRoutes from '@/routes/v1/cars';

// Root route
router.get('/', (req, res) => {
  res.status(200).json({
    message: "API is running",
    status:'ok',
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/cars', carRoutes);

export default router;
