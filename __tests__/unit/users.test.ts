import request from "supertest";
import { Request, Response } from "express";

import UserController from "../../src/app/controllers/UserController";
import app from "../../src/app";
import connection from "../../src/app/database/connection";

describe("Users", () => {

    const userController = new UserController();

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeAll(async () => {

        await connection.migrate.rollback();
        await connection.migrate.latest();
        await connection.seed.run();

    });

    beforeEach(() => {

        mockRequest = {};
        mockResponse = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        }

    })

    it("Should return status code 400 if user is not registered in database", async () => {

        jest.mock("../../src/app/database/connection", () => {
            return [ { id: 1 } ];
        })

        const expectedResponse = { errorMessage: "User not found" };
        mockRequest = {
            params: {
                id: "1"
            }
        }

        await userController.show(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);

    });

    afterAll(async () => {

        await connection.destroy();

    });

});
