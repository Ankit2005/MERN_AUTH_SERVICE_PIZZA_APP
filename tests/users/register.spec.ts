import request from "supertest";
import app from "../../src/app";

describe("POST /aut/register", () => {
    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            // Arrange
            const userData = {
                firtName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "1234",
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
                firtName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "1234",
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
                firtName: "ankit",
                lastName: "bharvad",
                email: "ankitmb15@gmail.com",
                password: "1234",
            };

            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
        });
    });

    describe("Fields are missing", () => {});
});
