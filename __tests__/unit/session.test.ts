import request from "supertest";

import app from "../../src/app";
import connection from "../../src/app/database/connection";

describe.skip("Session", () => {

    beforeAll(async () => {

        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run();

    });

    it("Should return status code 400 when credentials are missing", async () => {

        const response = await request(app).get("/session");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Credentials are missing")

    });

    it("Should return status code 400 if any credentials are missing", async () => {

        const credentials = `Basic ${Buffer.from("teste@teste.com:").toString("base64")}`;

        const response = await request(app).get("/session").set({ Authorization: credentials });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Invalid credentials");

    });

    it("Should return status code 400 if the email is not registered", async () => {

        const credentials = `Basic ${Buffer.from("teste01@teste.com:123456789").toString("base64")}`;

        const response = await request(app).get("/session").set({ Authorization: credentials });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("User not found with this e-mail")

    });

    it("Should return status code 400 if the wrong password is sent", async () => {

        const credentials = `Basic ${Buffer.from("teste@teste.com:12345678").toString("base64")}`;

        const response = await request(app).get("/session").set({ Authorization: credentials });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Invalid password");

    });

    it("Should return status code 200 and token if right credentials are sent", async () => {

        const credentials = `Basic ${Buffer.from("teste@teste.com:123456789").toString("base64")}`;

        const response = await request(app).get("/session").set({ Authorization: credentials });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");

    });

    afterAll(async () => {

        await connection.destroy();

    });

});
