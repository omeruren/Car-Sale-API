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
 * Models
 */
import { Brand } from '@/models/brand';

/**
 * Types
 */
import { Request, Response } from "express";

interface CreateBrandBody {
    name: string;
    logo?: string;
    isActive?: boolean;
}

interface UpdateBrandBody {
    name?: string;
    logo?: string;
    isActive?: boolean;
}

// Get all brands
export const getBrands = async (req: Request, res: Response): Promise<void> => {
    try {
        const { active, search, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter: any = {};
        if (active !== undefined) {
            filter.isActive = active === 'true';
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Get brands with pagination
        const brands = await Brand.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Brand.countDocuments(filter);

        res.status(200).json({
            code: '200',
            message: "Brands retrieved successfully",
            status: 'success',
            data: {
                brands,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
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
        
        logger.error(`Error in getBrands: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Get brand by ID
export const getBrandById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const brand = await Brand.findById(id);

        if (!brand) {
            res.status(404).json({
                code: '404',
                message: "Brand not found",
                status: 'error'
            });
            return;
        }

        res.status(200).json({
            code: '200',
            message: "Brand retrieved successfully",
            status: 'success',
            data: { brand },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in getBrandById: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Create brand
export const createBrand = async (req: Request<{}, {}, CreateBrandBody>, res: Response): Promise<void> => {
    try {
        const { name, logo, isActive = true } = req.body;

        // Validation
        if (!name) {
            res.status(400).json({
                code: '400',
                message: "Brand name is required",
                status: 'error'
            });
            return;
        }

        // Check if brand already exists
        const existingBrand = await Brand.findOne({ 
            name: { $regex: `^${name.trim()}$`, $options: 'i' }
        });

        if (existingBrand) {
            res.status(409).json({
                code: '409',
                message: "Brand with this name already exists",
                status: 'error'
            });
            return;
        }

        // Create brand
        const newBrand = new Brand({
            name: name.trim(),
            logo: logo?.trim(),
            isActive
        });

        const savedBrand = await newBrand.save();

        res.status(201).json({
            code: '201',
            message: "Brand created successfully",
            status: 'success',
            data: { brand: savedBrand },
            timestamp: new Date().toISOString()
        });

        logger.info(`Brand created: ${name}`);

    } catch (error) {
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

        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in createBrand: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Update brand
export const updateBrand = async (req: Request<{id: string}, {}, UpdateBrandBody>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, logo, isActive } = req.body;

        // Build update object
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (logo !== undefined) updateData.logo = logo?.trim();
        if (isActive !== undefined) updateData.isActive = isActive;

        // Check if brand exists
        const existingBrand = await Brand.findById(id);
        if (!existingBrand) {
            res.status(404).json({
                code: '404',
                message: "Brand not found",
                status: 'error'
            });
            return;
        }

        // Check name uniqueness if name is being updated
        if (name && name.trim().toLowerCase() !== existingBrand.name.toLowerCase()) {
            const duplicateBrand = await Brand.findOne({ 
                _id: { $ne: id },
                name: { $regex: `^${name.trim()}$`, $options: 'i' }
            });

            if (duplicateBrand) {
                res.status(409).json({
                    code: '409',
                    message: "Brand with this name already exists",
                    status: 'error'
                });
                return;
            }
        }

        // Update brand
        const updatedBrand = await Brand.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            code: '200',
            message: "Brand updated successfully",
            status: 'success',
            data: { brand: updatedBrand },
            timestamp: new Date().toISOString()
        });

        logger.info(`Brand updated: ${id}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in updateBrand: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Delete brand
export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const brand = await Brand.findById(id);
        if (!brand) {
            res.status(404).json({
                code: '404',
                message: "Brand not found",
                status: 'error'
            });
            return;
        }

        await Brand.findByIdAndDelete(id);

        res.status(200).json({
            code: '200',
            message: "Brand deleted successfully",
            status: 'success',
            timestamp: new Date().toISOString()
        });

        logger.info(`Brand deleted: ${id}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in deleteBrand: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};