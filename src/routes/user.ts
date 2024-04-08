import express, { NextFunction, RequestHandler, Response } from "express";

import { AppDataSource } from "../config/data-source";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { User } from "../entity/User";
import updateUserValidator from "../validators/update-user-validator";
import logger from "../config/logger";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
    "/",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req: CreateUserRequest, res: Response, next: NextFunction) =>
        userController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        userController.update(req, res, next) as unknown as RequestHandler,
);

export default router;
