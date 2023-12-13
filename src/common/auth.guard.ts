import { Request, Response, NextFunction } from 'express';
import { MiddlewareInterface } from './middleware.interface';

export class AuthGuard implements MiddlewareInterface {
    execute(req: Request, res: Response, next: NextFunction): void {
        req.user ? next() : res.status(401).end();
    }
}
