import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { User } from "../../src/entity/User";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";

describe("POST /aut/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it("should return valid json response", async () => {
            // Arrange
            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist the user in the database", async () => {
            // Arrange
            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            // console.log("users -->", await users);
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });
    });

    describe("Fields are missing", () => {});
});