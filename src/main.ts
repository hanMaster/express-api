import { Container, ContainerModule, interfaces } from 'inversify';
import 'reflect-metadata';
import { App } from './app';
import { ExceptionFilter } from './errors/exception.filter';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/user.controller';
import { LoggerInterface } from './logger/logger.interface';
import { TYPES } from './types';
import { ExceptionFilterInterface } from './errors/exception.filter.interface';
import { UsersControllerInterface } from './users/user-controller.interface';
import { UserSerivceInterface } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { ConfigServiceInterface } from './config/config.service.interface';
import { ConfigService } from './config/config.service';

export interface BootstrapReturnInterface {
    app: App;
    appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind): void => {
    bind<LoggerInterface>(TYPES.LoggerInterface).to(LoggerService).inSingletonScope();
    bind<ExceptionFilterInterface>(TYPES.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();
    bind<UsersControllerInterface>(TYPES.UsersControllerInterface).to(UsersController).inSingletonScope();
    bind<UserSerivceInterface>(TYPES.UserSerivceInterface).to(UserService).inSingletonScope();
    bind<ConfigServiceInterface>(TYPES.ConfigServiceInterface).to(ConfigService).inSingletonScope();
    bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap(): BootstrapReturnInterface {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
    return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
