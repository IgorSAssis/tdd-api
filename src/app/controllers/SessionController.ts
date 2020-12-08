import { Request, Response } from "express";
import bcrypt from "bcrypt";

import connection from "../database/connection";
import { sign } from "../../token/jwt";

export default class SessionController {

    async retrieveToken(request: Request, response: Response) {

        const credentials = request.headers.authorization;

        if (!credentials) {

            return response.status(400).send({ errorMessage: "Credentials are missing" });

        }

        const [ , token] = credentials.split(" ");
        const [email, password] = Buffer.from(token, "base64").toString().split(":");

        if (!email || !password) {

            return response.status(400).send({ errorMessage: "Invalid credentials" })

        }

        const user = await connection("user").select("id", "password").where("email", "=", email);

        if (user.length === 0) {

            return response.status(400).send({ errorMessage: "User not found with this e-mail" });

        }

        bcrypt.compare(password, user[0].password, (err, result) => {

            if (err) {

                throw err;

            }

            if (result) {

                const userToken = sign({ userId: user[0].id });
                
                return response.status(200).send({ token: userToken });

            }

            return response.status(400).send({ errorMessage: "Invalid password" });

        });

    }

}