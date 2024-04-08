import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: "root",
    password: "root",
    database: Config.DB_NAME,
    // Dont use this in production. Always keep false
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.{ts,js}"],
    migrations: ["src/migration/*.{ts,js}"],
    subscribers: [],
});
