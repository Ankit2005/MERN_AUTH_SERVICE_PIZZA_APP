import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";

describe("POST /aut/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
        // await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it.todo("should login the user ");
    });
});
