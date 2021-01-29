import request from "supertest";

import app from "../../src/app";
import connection from "../../src/app/database/connection";

describe.skip("User signUp", () => {

    beforeAll(async () => {

        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run();

    });

    it("Should return status code 400 if missing properties in request body", async () => {

        const user = { name: "", surname: "", email: "teste@teste.com", password: "12345" };

        const response = await request(app).post("/register").send(user);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Missing values in request body");

    });

    it("Should return status code 400 if already have a email registered.", async (done) => {

        const user = { name: "teste", surname: "testa", email: "teste@teste.com", password: "123456789" };

        try {
            
            const response = await request(app).post("/register").send(user);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("errorMessage");
            expect(response.body.errorMessage).toBe("E-mail already registered");
            done();

        }
        catch (err) {
            done(err);
        }

    });

    it("Should return status code 400 if password has less than 8 words", async () => {

        const user = { name: "teste", surname: "teste", email: "teste01@teste.com", password: "1234" };

        const response = await request(app).post("/register").send(user);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Password must have at least 8 letters");

    });

    it("Should return status code 201 if the user was created successfully", async () => {

        const user = { name: "teste", surname: "teste", email: "teste01@teste.com", password: "123456789" };

        const response = await request(app).post("/register").send(user);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("userId");
        expect(response.body.userId).not.toBe(undefined);

    });

    afterAll(async () => {

        await connection.destroy();

    });

});
