import { Request, Response, NextFunction } from "express";

import { verify } from "../../token/jwt";

export async function authorizationMiddleware(request: Request, response: Response, next: NextFunction) {


    if (!request.headers || !request.headers.authorization) {

        return response.status(400).send({ errorMessage: "Missing JWT token from the 'Authorization' header" });

    }

    const credentials = request.headers.authorization;

    const [, token] = credentials.split(" ");

    if (!token) {

        return response.status(400).send({ errorMessage: "Missing token in 'Authorization' header" });

    }

    try {

        const userId = verify(token)?.valueOf().userId;

        if (!userId) {

            return response.status(401).send({ errorMessage: "This token not contain a user identification" });

        }

        next();

    } catch (err) {

        return response.status(400).send({ errorMessage: `${err.name}: ${err.message}` });

    }
    
}
