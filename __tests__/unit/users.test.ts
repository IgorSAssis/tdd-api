import { Request, Response } from "express";
import Knex from "knex";
import bcrypt from "bcrypt";

import userController from "../../src/app/controllers/UserController";

describe("Users", () => {

    let mockUserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockKnex: Partial<Knex>;
    let mockBcrypt;

    beforeEach(() => {

        mockRequest = {};
        mockResponse = {
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        }
        mockUserController = userController();

    });

    describe("show method", () => {

        it("Should return status code 400 if user is not registered in database", async () => {

            mockRequest = {
                params: {
                    id: "1"
                }
            }

            mockKnex = () => {
                return {
                    where: jest.fn().mockImplementation(() => {
                        return []
                    }),
                }
            }

            const expectedResponse = { errorMessage: "User not found" };
            mockUserController = userController({ connection: mockKnex as Knex });

            await mockUserController.show(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);

        });

    });

    describe("create method", () => {

        it("Should return status code 400 if missing params in the request body", async () => {

            mockRequest = {
                body: {
                    name: "",
                    surname: "teste",
                    email: "teste@teste.com",
                    password: "12345"
                }
            }

            const expectedResponse = { errorMessage: "Missing values in request body" };

            await mockUserController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);

        });

        it("Should return status code 400 if the password size is less than 8 characters", async () => {

            mockRequest = {
                body: {
                    name: "teste",
                    surname: "teste",
                    email: "teste@teste.com",
                    password: "12345"
                }
            }

            const expectedResponse = { errorMessage: "Password must have at least 8 letters" };

            await mockUserController.create(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);

        });

        it("Should return status code 400 if an email already registered have been send in request body", async () => {

            const expectedResponse = { errorMessage: "E-mail already registered" };

            mockRequest = {
                body: {
                    name: "teste",
                    surname: "teste",
                    email: "teste@teste.com",
                    password: "12345678"
                }
            };

            mockKnex = () => {
                return {
                    where: jest.fn().mockImplementation(() => {
                        return [{ id: 1 }];
                    }),
                }
            };

            mockUserController = userController({ connection: mockKnex as Knex });

            await mockUserController.create(mockRequest as Request, mockResponse as Response);


            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.send).toHaveBeenCalledWith(expectedResponse);


        });

        it("Should return status code 201 and user id if the user was registered with success", async (done) => {

            const userId = 1;

            mockRequest = {
                body: {
                    name: "teste",
                    surname: "teste",
                    email: "teste@teste.com",
                    password: "123456789"
                }
            };

            mockResponse.json = jest.fn().mockReturnValue({ userId });

            mockKnex = () => {
                return {
                    insert: jest.fn().mockImplementation(() => {
                        return [{ id: userId }];
                    }),
                    where: jest.fn().mockImplementation(() => {
                        return [];
                    }),
                }
            };

            try {

                mockUserController = userController({ connection: mockKnex as Knex });

                await mockUserController.create(mockRequest as Request, mockResponse as Response);

                expect(mockResponse.status).toHaveBeenCalledWith(201);
                expect(mockResponse.json).toHaveBeenCalledWith({ userId });
                done();

            }
            catch (err) {

                done(err);

            }

        });

    });

});

