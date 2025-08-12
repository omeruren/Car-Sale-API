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
import { Category } from '@/models/category';

/**
 * Types
 */
import { Request, Response } from "express";

interface CreateCategoryBody {
    name: string;
    description?: string;
    isActive?: boolean;
}

interface UpdateCategoryBody {
    name?: string;
    description?: string;
    isActive?: boolean;
}

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const { active, search, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter: any = {};
        if (active !== undefined) {
            filter.isActive = active === 'true';
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Get categories with pagination
        const categories = await Category.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Category.countDocuments(filter);

        res.status(200).json({
            code: '200',
            message: "Categories retrieved successfully",
            status: 'success',
            data: {
                categories,
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
        
        logger.error(`Error in getCategories: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            res.status(404).json({
                code: '404',
                message: "Category not found",
                status: 'error'
            });
            return;
        }

        res.status(200).json({
            code: '200',
            message: "Category retrieved successfully",
            status: 'success',
            data: { category },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in getCategoryById: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Create category
export const createCategory = async (req: Request<{}, {}, CreateCategoryBody>, res: Response): Promise<void> => {
    try {
        const { name, description, isActive = true } = req.body;

        // Validation
        if (!name) {
            res.status(400).json({
                code: '400',
                message: "Category name is required",
                status: 'error'
            });
            return;
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ 
            name: { $regex: `^${name.trim()}$`, $options: 'i' }
        });

        if (existingCategory) {
            res.status(409).json({
                code: '409',
                message: "Category with this name already exists",
                status: 'error'
            });
            return;
        }

        // Create category
        const newCategory = new Category({
            name: name.trim(),
            description: description?.trim(),
            isActive
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            code: '201',
            message: "Category created successfully",
            status: 'success',
            data: { category: savedCategory },
            timestamp: new Date().toISOString()
        });

        logger.info(`Category created: ${name}`);

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
        
        logger.error(`Error in createCategory: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Update category
export const updateCategory = async (req: Request<{id: string}, {}, UpdateCategoryBody>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        // Build update object
        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description?.trim();
        if (isActive !== undefined) updateData.isActive = isActive;

        // Check if category exists
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            res.status(404).json({
                code: '404',
                message: "Category not found",
                status: 'error'
            });
            return;
        }

        // Check name uniqueness if name is being updated
        if (name && name.trim().toLowerCase() !== existingCategory.name.toLowerCase()) {
            const duplicateCategory = await Category.findOne({ 
                _id: { $ne: id },
                name: { $regex: `^${name.trim()}$`, $options: 'i' }
            });

            if (duplicateCategory) {
                res.status(409).json({
                    code: '409',
                    message: "Category with this name already exists",
                    status: 'error'
                });
                return;
            }
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            code: '200',
            message: "Category updated successfully",
            status: 'success',
            data: { category: updatedCategory },
            timestamp: new Date().toISOString()
        });

        logger.info(`Category updated: ${id}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in updateCategory: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({
                code: '404',
                message: "Category not found",
                status: 'error'
            });
            return;
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            code: '200',
            message: "Category deleted successfully",
            status: 'success',
            timestamp: new Date().toISOString()
        });

        logger.info(`Category deleted: ${id}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in deleteCategory: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};