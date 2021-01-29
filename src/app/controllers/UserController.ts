import { Request, Response } from "express";
import bcrypt from "bcrypt";

import connection from "../database/connection";

function userController(configuration = {}) {

    const database = configuration.connection || connection;

    async function create(request: Request, response: Response) {

        const { name, surname, email, password } = request.body;

        if (!name || !surname || !email || !password) {

            return response.status(400).send({ errorMessage: "Missing values in request body" });

        }

        if (password.length < 8) {

            return response.status(400).send({ errorMessage: "Password must have at least 8 letters" })

        }

        const user = await database("user").where("email", "=", email);

        if (user.length > 0) {

            return response.status(400).send({ errorMessage: "E-mail already registered" });

        }

        bcrypt.hash(password, 10, async function (err, hash) {

            if (err) {
                console.log("OU NOUUUUUUUUUUUUUUUUUUUUUUUUUUUU")
                throw err;

            }

            const [userId] = await database("user").insert({ name, surname, email, password: hash });
            return response.status(201).json({ userId });


        });

    }

    async function listAll(request: Request, response: Response) {

        const users = await database("user");

        return response.status(200).json(users);

    }

    async function show(request: Request, response: Response) {

        const { id } = request.params;

        const userData = await database("user").where("id", "=", id);

        if (userData.length === 0) {

            return response.status(400).send({ errorMessage: "User not found" });

        }

        return response.status(200).json({ user: userData[0] });

    }

    return {

        create,
        listAll,
        show

    }

}

export default userController;