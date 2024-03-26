import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import { AuthController } from "../controllers/AuthController";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import authenticate from "../middlewares/authenticate";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";
import { CredentialService } from "../services/CredentialService";
import { TokenService } from "../services/TokenService";
import { UserService } from "../services/UserService";
import { AuthRequest } from "../types";
import loginValidators from "../validators/login-validators";
import registerValidators from "../validators/register-validators";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();

const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
);

router.post(
    "/register",
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

router.post(
    "/login",
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

// router.get("/self", authenticate, (req: Request, res: Response) =>
//     authController.self(req as AuthRequest, res),
// );

router.get(
    "/self",
    authenticate as RequestHandler,
    (req: Request, res: Response) =>
        authController.self(
            req as AuthRequest,
            res,
        ) as unknown as RequestHandler,
);

router.post(
    "/refresh",
    validateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as AuthRequest, res, next),
);

// router.post(
//     "/logout",
//     authenticate,
//     parseRefreshToken,
//     (req: Request, res: Response, next: NextFunction) =>
//         authController.logout(req as AuthRequest, res, next),
// );

router.post(
    "/logout",
    authenticate as RequestHandler,
    parseRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(
            req as AuthRequest,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
