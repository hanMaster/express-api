import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware.interface';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements MiddlewareInterface {
    constructor(private readonly secret: string) {}
    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            const jwt = req.headers.authorization.split(' ')[1];
            verify(jwt, this.secret, (err, payload) => {
                if (payload && typeof payload !== 'string') {
                    req.user = payload.email;
                    next();
                } else {
                    next();
                }
            });
        } else {
            next();
        }
    }
}
