import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { AuthRequest } from "../types";

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const roleFromToken: string = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            const error = createHttpError(
                403,
                "You don't have enogh permissions",
            );
            next(error);
            return;
        }

        next();
    };
};
