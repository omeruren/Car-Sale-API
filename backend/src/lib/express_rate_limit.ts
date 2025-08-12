/**
 * @copyright 2025 omeruren
 * @license Apache-2.0
 * @author omeruren
 */

/**
 * Node Modules
 */

import {rateLimit} from "express-rate-limit";

// Rate Limiting Configuration

const limiter = rateLimit({
    windowMs: 60* 1000, // 1 minute
    limit: 50,
    standardHeaders :'draft-8',
    legacyHeaders: false,
    message: {
        code: 429,
        error: "Too many requests, please try again later.",
    }
})

export default limiter;