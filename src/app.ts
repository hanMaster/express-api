import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';

import { LoggerInterface } from './logger/logger.interface';
import { UsersController } from './users/users.controller';
import { ExceptionFilterInterface } from './errors/exception.filter.interface';
import { TYPES } from './types';

@injectable()
export class App {
   app: Express;
   port: number;
   server: Server;

   constructor(
      @inject(TYPES.LoggerInterface) private logger: LoggerInterface,
      @inject(TYPES.UsersControllerInterface) private userController: UsersController,
      @inject(TYPES.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
   ) {
      this.app = express();
      this.port = 8000;
   }

   useRoutes(): void {
      this.app.use('/users', this.userController.router);
   }

   useExceptionFilters(): void {
      this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
   }

   public async init(): Promise<void> {
      this.useRoutes();
      this.useExceptionFilters();
      this.server = this.app.listen(this.port);
      this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
   }
}
