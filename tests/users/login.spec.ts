import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/data-source";
import { isJwt } from "../utils";

describe("POST /aut/login", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    // beforeEach(async () => {
    //     // Database truncate
    //     await connection.dropDatabase();
    //     await connection.synchronize();
    //     // await truncateTables(connection);
    // });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given login all fields", () => {
        it("should return the 200 status code if login successfully", async () => {
            // Arrange
            const userData = {
                age: "26",
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(201);

            // check login

            // Arrange
            const data = {
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
            };

            // Act
            const loginResponse = await request(app)
                .post("/auth/login")
                .send(data);

            // Assert
            expect(loginResponse.statusCode).toBe(200);
        });

        it("should return the access token and refresh token inside a cookie", async () => {
            // Arrange

            const userData = {
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
            };

            // Act
            const response = await request(app)
                .post("/auth/login")
                .send(userData);

            // Assert

            let accessToken: string | null = null;
            let refreshToken: string | null = null;

            interface Headers {
                "set-cookie"?: string[];
            }

            const headers = response.headers as Headers;
            // console.log(headers);

            const cookies = headers["set-cookie"] || [];
            // console.log(cookies);

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });

        it("should return 400 if email or password not match or empty", async () => {
            // Arrange
            const data = {
                email: "",
                password: "",
            };

            // Act
            const loginResponse = await request(app)
                .post("/auth/login")
                .send(data);

            // Assert
            expect(loginResponse.statusCode).toBe(400);
        });
    });
});
