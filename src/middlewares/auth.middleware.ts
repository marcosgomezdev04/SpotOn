import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ScheduleModel } from "../models/schedule.model";

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
        (req as any).userId = payload.id;
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

    if (!currentUser) {
        res.status(401).json({ message: "Token not provided" });
        return;
    }

    if (currentUser.role !== "ADMIN") {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    next();
};

export const requireOwnerOrAdmin = (
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

    if (currentUser.role === "ADMIN") {
        next();
        return;
    }

    if (!targetId || currentUser.id === targetId) {
        next();
        return;
    }

    res.status(403).json({ message: "Forbidden" });
};

export const authorizeScheduleAccess = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    const currentUser = (req as any).user;
    const scheduleId = req.params.id;

    if (!currentUser) {
        res.status(401).json({ message: "Token not provided" });
        return;
    }

    if (currentUser.role === "ADMIN") {
        next();
        return;
    }

    try {
        const schedule = await ScheduleModel.findById(scheduleId);

        if (!schedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }

        if (schedule.userId?.toString() !== currentUser.id) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }

        next();

    } catch {
        res.status(500).json({ message: "Error validating schedule access" });
    }
};