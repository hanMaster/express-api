import { Request, Response, NextFunction, Router } from 'express';
import { MiddlewareInterface } from './middleware.interface';

export interface ControllerRouteInterface {
    path: string;
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
    middlewares?: MiddlewareInterface[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
