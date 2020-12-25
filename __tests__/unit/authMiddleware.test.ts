import { Request, Response, NextFunction } from "express";
import { authorizationMiddleware } from "../../src/app/middlewares/auth";

import { sign } from "../../src/token/jwt";

describe("Authentication middleware", () => {

    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNextFunction: NextFunction = jest.fn();

    beforeEach(() => {

        mockRequest = {
            headers: {}
        };
        mockResponse = {
            send: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

    });

    it("Should return status code 400 if credentials is not provided", async () => {

        const expectedResponse = { errorMessage: "Missing JWT token from the 'Authorization' header" };

        await authorizationMiddleware(mockRequest as Request, mockResponse as Response, mockNextFunction);

        expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);

    });

    it("Should return status code 400 if token is not provided", async () => {

        const expectedResponse = { errorMessage: "Missing token in 'Authorization' header" };
        mockRequest = {
            headers: {
                authorization: "Bearer "
            }
        }

        await authorizationMiddleware(mockRequest as Request, mockResponse as Response, mockNextFunction);

        expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);

    });

    it("Should return status code 400 if user identification is not in the token", async () => {

        const expectedResponse = { errorMessage: "This token not contain a user identification" };
        mockRequest = {
            headers: {
                authorization: `Bearer ${sign({ userId: "" })}`
            }
        }

        await authorizationMiddleware(mockRequest as Request, mockResponse as Response, mockNextFunction);

        expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(401);

    });

    it("Should call next function if authorization token is a valid JWT token", async (done) => {

        mockRequest = {
            headers: {
                authorization: `Bearer ${sign({ userId: 1 })}`
            }
        }

        try {

            await authorizationMiddleware(mockRequest as Request, mockResponse as Response, mockNextFunction);

            expect(mockNextFunction).toBeCalled();
            expect(mockResponse.send).not.toBeCalled();
            expect(mockResponse.status).not.toBeCalled();
            done();

        }
        catch (err) {

            done(err);

        }

    });

});
