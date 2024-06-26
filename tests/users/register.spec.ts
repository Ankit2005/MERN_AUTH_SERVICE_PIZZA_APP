import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { User } from "../../src/entity/User";
import { AppDataSource } from "../../src/config/data-source";
import { Roles } from "../../src/constants";
import { isJwt } from "../utils";
import { RefreshToken } from "../../src/entity/RefreshToken";
// import { truncateTables } from "../utils";

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
        it("should return the 201 status code", async () => {
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
        });

        it("should return valid json response", async () => {
            // Arrange
            const userData = {
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
                password: "ankit2005",
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

        it("should return an id of the created user", async () => {
            // Arrange
            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            //expect(232).toBe(232);
        });

        it("should assing a customer role", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb2005@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it("should store the hashed password in the database", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb2005@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find({ select: ["password"] });
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should reutn 400 status code if email is already exists", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb2005@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save(userData);

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const users = await userRepository.find();
            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it("should return the access token and refresh token inside a cookie", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb2005@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
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

        it("should store then refresh token in the databse", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb2005@gmail.com",
                password: "ankit2005",
                role: Roles.CUSTOMER,
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert

            const refreshTokenRepo = connection.getRepository(RefreshToken);

            const tokens = await refreshTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();

            expect(tokens).toHaveLength(1);
        });
    });

    describe("Fields are missing", () => {
        it("should return 400 status code if email fields is missing", async () => {
            // Arrange

            const userData = {
                firstName: "Ankit",
                lastName: "bharvad",
                email: "",
                password: "ankit2005",
            };

            // Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert

            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });

        it("should return 400 status code if firstName is missing", async () => {
            // Arrange

            const userData = {
                firstName: "",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
            };

            // Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("should return 400 status code if lastName is missing", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "",
                email: "ankitmb15@gmail.com",
                password: "ankit2005",
            };

            // Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("should return 400 status code if password is missing", async () => {
            // Arrange

            const userData = {
                firstName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "",
            };

            // Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            // Arrange

            const userData = {
                firstName: "Ankit",
                lastName: "bharvad",
                email: "  ankitmb15@gmail.com  ",
                password: "ankit2005",
            };

            // Act

            await request(app).post("/auth/register").send(userData);
            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];

            expect(user.email).toBe("ankitmb15@gmail.com");
        });

        it("should return 400 status code if email is not valid email ", async () => {
            // Arrange

            const userData = {
                firstName: "Ankit",
                lastName: "bharvad",
                email: "ankitmb15",
                password: "ankit2005",
            };

            // Act

            const res = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it("should return 400 status code if password length is less then 8 chars", async () => {
            // Arrange

            const userData = {
                firstName: "Ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "ankit",
            };

            // Act

            const res = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(res.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it.todo("should return an array of error message if email is missing");
    });
});
