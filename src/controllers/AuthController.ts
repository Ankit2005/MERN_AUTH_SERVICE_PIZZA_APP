import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { JwtPayload, sign } from "jsonwebtoken";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";
import createHttpError from "http-errors";
import { Config } from "../config";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // Validations
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        this.logger.debug("New request to register a user", {
            firstName,
            lastName,
            email,
            password: "******",
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info("User has been registered", { id: user.id });
            let privatekey: Buffer;
            try {
                privatekey = fs.readFileSync(
                    path.join(__dirname, "../../certs/private.pem"),
                );
            } catch (error) {
                const err = createHttpError(
                    500,
                    "Error while reading private key",
                );
                next(err);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = sign(payload, privatekey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service",
            });
            // console.log(accessToken); .

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: "HS256",
                expiresIn: "1y",
                issuer: "auth-service",
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // expire in 1h
                httpOnly: true, // very important flag
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // expire in 1-year
                httpOnly: true, // very important flag
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
