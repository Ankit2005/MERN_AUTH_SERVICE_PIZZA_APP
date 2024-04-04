import createHttpError from "http-errors";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserData } from "../types";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password, role }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });

        if (user) {
            const error = createHttpError(400, "Emal is already exists");
            throw error;
        }

        // Hash the password
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashPassword,
                role,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to store then data in the database",
            );
            throw error;
        }
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email: email },
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
}
