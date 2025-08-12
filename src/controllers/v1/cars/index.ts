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
import { Car } from '@/models/car';
import { Brand } from '@/models/brand';
import { Category } from '@/models/category';

/**
 * Types
 */
import { Request, Response } from "express";

interface CreateCarBody {
    title: string;
    description: string;
    brand: string;
    carModel: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'lpg';
    transmission: 'manual' | 'automatic';
    bodyType: 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'wagon' | 'pickup';
    color: string;
    engineSize: number;
    horsepower?: number;
    drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
    condition: 'new' | 'used' | 'certified';
    features: string[];
    images: string[];
    location: {
        city: string;
        district: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    category: string;
    isPromoted?: boolean;
    promotedUntil?: Date;
}

// Get all cars
export const getCars = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            status,
            brand,
            category,
            fuelType,
            transmission,
            bodyType,
            condition,
            minPrice,
            maxPrice,
            minYear,
            maxYear,
            city,
            search,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter: any = {};
        
        if (status) filter.status = status;
        if (brand) filter.brand = brand;
        if (category) filter.category = category;
        if (fuelType) filter.fuelType = fuelType;
        if (transmission) filter.transmission = transmission;
        if (bodyType) filter.bodyType = bodyType;
        if (condition) filter.condition = condition;
        if (city) filter['location.city'] = { $regex: city, $options: 'i' };

        // Price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Year range
        if (minYear || maxYear) {
            filter.year = {};
            if (minYear) filter.year.$gte = Number(minYear);
            if (maxYear) filter.year.$lte = Number(maxYear);
        }

        // Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { carModel: { $regex: search, $options: 'i' } },
                { color: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        // Sort
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        // Get cars with population
        const cars = await Car.find(filter)
            .populate('brand', 'name logo')
            .populate('category', 'name description')
            .populate('seller', 'firstName lastName email phone')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Car.countDocuments(filter);

        res.status(200).json({
            code: '200',
            message: "Cars retrieved successfully",
            status: 'success',
            data: {
                cars,
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
        
        logger.error(`Error in getCars: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Get car by ID
export const getCarById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const car = await Car.findById(id)
            .populate('brand', 'name logo')
            .populate('category', 'name description')
            .populate('seller', 'firstName lastName email phone');

        if (!car) {
            res.status(404).json({
                code: '404',
                message: "Car not found",
                status: 'error'
            });
            return;
        }

        // Increment view count
        await Car.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

        res.status(200).json({
            code: '200',
            message: "Car retrieved successfully",
            status: 'success',
            data: { car },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in getCarById: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Create car
export const createCar = async (req: Request<{}, {}, CreateCarBody>, res: Response): Promise<void> => {
    try {
        const carData = req.body;

        // Validation
        if (!carData.title || !carData.description || !carData.brand || !carData.category) {
            res.status(400).json({
                code: '400',
                message: "Title, description, brand, and category are required",
                status: 'error'
            });
            return;
        }

        // Verify brand exists
        const brandExists = await Brand.findById(carData.brand);
        if (!brandExists) {
            res.status(400).json({
                code: '400',
                message: "Invalid brand ID",
                status: 'error'
            });
            return;
        }

        // Verify category exists
        const categoryExists = await Category.findById(carData.category);
        if (!categoryExists) {
            res.status(400).json({
                code: '400',
                message: "Invalid category ID",
                status: 'error'
            });
            return;
        }

        // Get seller from authenticated user
        if (!req.user) {
            res.status(401).json({
                code: '401',
                message: "Authentication required",
                status: 'error'
            });
            return;
        }

        // Create car
        const newCar = new Car({
            ...carData,
            seller: req.user.userId,
            status: 'active'
        });

        const savedCar = await newCar.save();
        
        // Populate the saved car
        const populatedCar = await Car.findById(savedCar._id)
            .populate('brand', 'name logo')
            .populate('category', 'name description')
            .populate('seller', 'firstName lastName email phone');

        res.status(201).json({
            code: '201',
            message: "Car created successfully",
            status: 'success',
            data: { car: populatedCar },
            timestamp: new Date().toISOString()
        });

        logger.info(`Car created: ${carData.title} by user ${req.user.userId}`);

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
        
        logger.error(`Error in createCar: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Update car
export const updateCar = async (req: Request<{id: string}, {}, Partial<CreateCarBody>>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if car exists and belongs to user
        const existingCar = await Car.findById(id);
        if (!existingCar) {
            res.status(404).json({
                code: '404',
                message: "Car not found",
                status: 'error'
            });
            return;
        }

        // Check ownership (seller can update their own cars, admin can update any)
        if (req.user?.role !== 'admin' && existingCar.seller.toString() !== req.user?.userId) {
            res.status(403).json({
                code: '403',
                message: "You can only update your own cars",
                status: 'error'
            });
            return;
        }

        // Verify brand if updating
        if (updateData.brand) {
            const brandExists = await Brand.findById(updateData.brand);
            if (!brandExists) {
                res.status(400).json({
                    code: '400',
                    message: "Invalid brand ID",
                    status: 'error'
                });
                return;
            }
        }

        // Verify category if updating
        if (updateData.category) {
            const categoryExists = await Category.findById(updateData.category);
            if (!categoryExists) {
                res.status(400).json({
                    code: '400',
                    message: "Invalid category ID",
                    status: 'error'
                });
                return;
            }
        }

        // Update car
        const updatedCar = await Car.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('brand', 'name logo')
         .populate('category', 'name description')
         .populate('seller', 'firstName lastName email phone');

        res.status(200).json({
            code: '200',
            message: "Car updated successfully",
            status: 'success',
            data: { car: updatedCar },
            timestamp: new Date().toISOString()
        });

        logger.info(`Car updated: ${id} by user ${req.user?.userId}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in updateCar: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};

// Delete car
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const car = await Car.findById(id);
        if (!car) {
            res.status(404).json({
                code: '404',
                message: "Car not found",
                status: 'error'
            });
            return;
        }

        // Check ownership (seller can delete their own cars, admin can delete any)
        if (req.user?.role !== 'admin' && car.seller.toString() !== req.user?.userId) {
            res.status(403).json({
                code: '403',
                message: "You can only delete your own cars",
                status: 'error'
            });
            return;
        }

        await Car.findByIdAndDelete(id);

        res.status(200).json({
            code: '200',
            message: "Car deleted successfully",
            status: 'success',
            timestamp: new Date().toISOString()
        });

        logger.info(`Car deleted: ${id} by user ${req.user?.userId}`);

    } catch (error) {
        res.status(500).json({
            code: '500',
            message: "Internal Server Error",
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        logger.error(`Error in deleteCar: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};