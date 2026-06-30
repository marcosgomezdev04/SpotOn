import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtUserPayload {
    id: string;
    email: string;
    role: string;
}

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
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
        (req as any).user = payload;
        next();

    } catch {
        res.status(401).json({
            message: "Invalid token"
        });
    }
};

export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const currentUser = (req as any).user;

    if (!currentUser || currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    next();
};

export const requireOwner = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    
    const currentUser = (req as any).user;
    const targetId = req.params.id;

    if (!currentUser) {
        res.status(401).json({ message: "Token not provided" });
        return;
    }

    if (currentUser.role === "ADMIN" || currentUser.id === targetId) {
        next();
        return;
    }

    res.status(403).json({ message: "Forbidden" });
};