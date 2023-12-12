import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from './../logger/logger.interface';
import { BaseController } from '../common/base.controller';
import { ControllerRouteInterface } from '../common/route.interface';
import { HttpError } from '../errors/http-error';
import { TYPES } from '../types';
import { UsersControllerInterface } from './users.interface';

@injectable()
export class UsersController extends BaseController implements UsersControllerInterface {
   constructor(@inject(TYPES.LoggerInterface) private readonly loggerService: LoggerInterface) {
      super(loggerService);
      const userRoutes: ControllerRouteInterface[] = [
         {
            path: '/register',
            method: 'post',
            func: this.register,
         },
         {
            path: '/login',
            method: 'post',
            func: this.login,
         },
      ];
      this.bindRoutes(userRoutes);
   }

   register(req: Request, res: Response, next: NextFunction): void {
      console.log('debug');

      this.ok(res, 'register');
   }

   login(req: Request, res: Response, next: NextFunction): void {
      next(new HttpError(401, 'Ошибка авторизации', 'login'));
   }
}
