import { Request, Response, NextFunction, Router } from 'express';

export interface ControllerRouteInterface {
   path: string;
   func: (req: Request, res: Response, next: NextFunction) => void;
   method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
}

export type ExpressReturnType = Response<any, Record<string, any>>;
