import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import createJWKSMock from "mock-jwks";

describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        // Database truncate
        await connection.dropDatabase();
        await connection.synchronize();
        // await truncateTables(connection);
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given login all fields", () => {
        it("should return the 200 status code", async () => {
            // Generate token
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();
            expect(response.statusCode).toBe(200);
        });

        it("should return the user data", async () => {
            // Register user

            const userData = {
                age: "26",
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };
            const userRepository = connection.getRepository(User);
            const createdUserData = await userRepository.save(userData);

            // Generate token
            const accessToken = jwks.token({
                sub: String(createdUserData.id),
                role: createdUserData.role,
            });
            // Add token to cookie

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            // Assert
            // Check if user id matches with registered user
            expect((response.body as Record<string, string>).id).toBe(
                createdUserData.id,
            );
        });

        it("should not return then password field ", async () => {
            // Register user

            const userData = {
                age: "26",
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };
            const userRepository = connection.getRepository(User);
            const createdUserData = await userRepository.save(userData);

            // Generate token
            const accessToken = jwks.token({
                sub: String(createdUserData.id),
                role: createdUserData.role,
            });
            // Add token to cookie

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            // Assert
            // Check if user id matches with registered user
            expect(response.body as Record<string, string>).not.toHaveProperty(
                "password",
            );
        });

        it("should not return 401 status code if token does not exists ", async () => {
            // Register user

            const userData = {
                age: "26",
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            const response = await request(app).get("/auth/self").send();

            // Assert
            expect(response.statusCode).toBe(401);
        });
    });
});
