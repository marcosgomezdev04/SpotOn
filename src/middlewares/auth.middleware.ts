import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BookingModel } from "../models/booking.model";

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

export const requireBookingOwnerOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const currentUser = (req as any).user;
    const bookingId = req.params.id;

    if (!currentUser) {
        res.status(401).json({ message: "Token not provided" });
        return;
    }

    if (currentUser.role === "ADMIN") {
        next();
        return;
    }

    if (!bookingId) {
        res.status(400).json({ message: "Booking id is required" });
        return;
    }

    try {
        const booking = await BookingModel.findById(bookingId);

        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        if (booking.userId.toString() === currentUser.id) {
            next();
            return;
        }

        res.status(403).json({ message: "Forbidden" });
    } catch {
        res.status(400).json({ message: "Invalid booking id" });
    }
};
