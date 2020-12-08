import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const secret = process.env.JWT_SECRET_TOKEN;

export const sign = (payload: Object) => secret && jwt.sign(payload, secret);
export const verify = (token: string) =>  secret && jwt.verify(token, secret);
