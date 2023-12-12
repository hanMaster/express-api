import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { Server } from 'http';

import { LoggerInterface } from './logger/logger.interface';
import { UsersController } from './users/user.controller';
import { ExceptionFilterInterface } from './errors/exception.filter.interface';
import { TYPES } from './types';
import { ConfigServiceInterface } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.LoggerInterface) private logger: LoggerInterface,
        @inject(TYPES.UsersControllerInterface) private userController: UsersController,
        @inject(TYPES.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
        @inject(TYPES.ConfigServiceInterface) private configService: ConfigServiceInterface,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = Number(this.configService.get('PORT'));
    }

    useMiddleware(): void {
        this.app.use(express.json());
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
    }
}
