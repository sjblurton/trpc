import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET || "changeme";

export const signJwt = (data: object) => jwt.sign(data, SECRET);

export const verifyJwt = <T>(token: string) => jwt.verify(token, SECRET) as T;
