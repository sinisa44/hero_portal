import * as jwt from 'jsonwebtoken';
interface DecodeToken  {
        sub: string
        username: string,
        iat: number,
        exp: number
}


const decodeToken = (authorization:string): DecodeToken=> {

    const token = authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodeToken;

    return decodedToken
}

export default decodeToken