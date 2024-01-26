import { NextFunction, Response } from "express";
import { Logger } from "winston";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

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
        const { firstName, lastName, email, password } = req.body;
        this.logger.debug("New request to register a user", {
            firstName,
            lastName,
            email,
            password: "******",
        });
        try {
            // console.log(req.body);
            await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info("User has been registered", { id: 2 });
            res.status(201).json({ id: 2 });
        } catch (error) {
            next(error);
            return;
        }
    }
}
