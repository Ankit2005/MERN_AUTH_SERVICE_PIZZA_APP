import { Response } from "express";
import { UserService } from "../services/UserService";
import { RegisterUserRequest } from "../types";

export class AuthController {
    constructor(private userService: UserService) {}

    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        // console.log(req.body);
        await this.userService.create({
            firstName,
            lastName,
            email,
            password,
        });
        //   console.log(user);
        res.status(201).json({ id: 232 });
    }
}
