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
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            // console.log(user);
            this.logger.info("User has been registered", { id: user.id });
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
