import jwt from "jsonwebtoken";

interface IToken {
    id: string;
    iat: number;
    exp: number;
}

export const verifyJWT = (token: string): IToken => {
    return jwt.verify(token, process.env.JWT_SECRET) as IToken;
}