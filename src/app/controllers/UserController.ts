import { Request, Response } from "express";
import bcrypt from "bcrypt";

import connection from "../database/connection";

export default class UserController {

    async create(request: Request, response: Response) {

        const { name, surname, email, password } = request.body;

        if (!name || !surname || !email || !password) {

            return response.status(400).send({ errorMessage: "Missing values in request body" });

        }

        const user = await connection("user").where("email", "=", email);

        if(user.length > 0) {
            
            return response.status(400).send({ errorMessage: "E-mail already registered" });

        }

        if(password.length < 8) {

            return response.status(400).send({ errorMessage: "Password must have at least 8 letters"})
            
        }

        bcrypt.genSalt(10, function (err, salt) {

            if (err) {

                throw err;

            }

            bcrypt.hash(password, salt, async function (err, hash) {

                if (err) {

                    throw err;

                }

                const userId = await connection("user").insert({ name, surname, email, password: hash });
                return response.status(201).json({ userId });

            });

        });

    }

    async listAll(request: Request, response: Response) {

        

        return response.status(200).send();

    }

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const userData = await connection("user").where("id", "=", id);

        if (userData.length === 0) {

            return response.status(400).send({ errorMessage: "User not found" });

        }

        return response.status(200).send();

    }

}