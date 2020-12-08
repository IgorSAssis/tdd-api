import { Request, Response, NextFunction } from "express";

import connection from "../database/connection";
import { verify } from "../../token/jwt";

export async function verifyToken(request: Request, response: Response, next: NextFunction) {

    const credentials = request.headers.authorization;

    if (!credentials) {

        return response.status(400).send({ errorMessage: "Bearer token must be provided" });

    }

    const [, token] = credentials.split(" ");

    if (!token) {

        return response.status(400).send({ errorMessage: "Missing token" });

    }

    try {

        const userId = verify(token)?.valueOf().userId;

        if (!userId) {

            return response.status(400).send({ errorMessage: "This token not contain a user identification" });

        }

        const user = await connection("user").where("id", "=", userId);

        if (user.length === 0) {

            return response.status(400).send({ errorMessage: "The token contain an invalid identification" });

        }

        next();

    } catch (err) {

        return response.status(400).send({ errorMessage: `${err.name}: ${err.message}` });

    }
    
}
