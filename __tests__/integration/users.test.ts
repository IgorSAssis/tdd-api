import request from "supertest";

import app from "../../src/app";
import connection from "../../src/app/database/connection";
import { sign } from "../../src/token/jwt";

describe("Users", () => {

    beforeAll(async () => {

        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run();

    });

    it("Should return status code 400 if credentials is not provided", async () => {

        const response = await request(app).get("/users");

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Bearer token must be provided");

    });

    it("Should return status code 400 if token is not provided", async () => {

        const credentials = `Bearer `;

        const response = await request(app).get("/users").set({ Authorization: credentials });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errorMessage");
        expect(response.body.errorMessage).toBe("Missing token");

    });

    it("Should return status code 400 if token identification are not found in database", async () => {

        const user = await connection("user");

        console.log(user);

        expect(user).not.toBe([]);

    });


    afterAll(async () => {

        await connection.destroy();

    });

});
