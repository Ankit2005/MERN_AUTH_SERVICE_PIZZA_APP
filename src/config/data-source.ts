import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: "root",
    password: "root",
    database: Config.DB_NAME,
    // Dont use this in production. Always keep false
    synchronize: true,
    logging: false,
    entities: [User, RefreshToken],
    migrations: [],
    subscribers: [],
});
