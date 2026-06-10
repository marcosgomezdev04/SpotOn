import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            message: "Token not provided"
        });
        return;
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const payload =
            jwt.verify(
                token,
                process.env.JWT_SECRET!
            );

        (req as any).user = payload;

        next();

    } catch {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};