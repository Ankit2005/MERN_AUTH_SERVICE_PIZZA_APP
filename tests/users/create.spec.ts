import { DataSource } from "typeorm";
import request from "supertest";
import createJWKSMock from "mock-jwks";

import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /users", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
        jwks = createJWKSMock("http://localhost:5501");
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should persist the db-user in the database", async () => {
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Register user
            const userData = {
                firstName: "Ankit",
                lastName: "Bharvad",
                email: "ankit@gmail.com",
                password: "1234",
                tenantId: 1,
            };

            // Add token to cookie
            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            // expect(users[0].role).toBe(Roles.ADMIN);
            expect(users[0].email).toBe(userData.email);
        });

        it("should create a manager user", async () => {
            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Register user
            const userData = {
                firstName: "Ankit",
                lastName: "Bharvad",
                email: "ankit@gmail.com",
                password: "1234",
                tenantId: 1,
            };

            // Add token to cookie
            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
            // expect(users[0].email).toBe(userData.email);
        });

        it.todo("should return 403 if non admin user tries to create a user");
    });
});