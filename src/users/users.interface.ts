import { NextFunction, Request, Response } from 'express';

export interface UsersControllerInterface {
   register: (req: Request, res: Response, next: NextFunction) => void;
   login: (req: Request, res: Response, next: NextFunction) => void;
}
