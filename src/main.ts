import { Container, ContainerModule, interfaces } from 'inversify';
import 'reflect-metadata';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { LoggerInterface } from './logger/logger.interface';
import { TYPES } from './types';
import { ExceptionFilterInterface } from './errors/exception.filter.interface';
import { UsersControllerInterface } from './users/users.interface';

export interface BootstrapReturnInterface {
   app: App;
   appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind): void => {
   bind<LoggerInterface>(TYPES.LoggerInterface).to(LoggerService);
   bind<ExceptionFilterInterface>(TYPES.ExceptionFilterInterface).to(ExceptionFilter);
   bind<UsersControllerInterface>(TYPES.UsersControllerInterface).to(UsersController);
   bind<App>(TYPES.Application).to(App);
});

function bootstrap(): BootstrapReturnInterface {
   const appContainer = new Container();
   appContainer.load(appBindings);
   const app = appContainer.get<App>(TYPES.Application);
   app.init();
   return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
