import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { BaseController } from '../common/base.controller';
import { ControllerRouteInterface } from '../common/route.interface';
import { HttpError } from '../errors/http-error';
import { TYPES } from '../types';
import { UsersControllerInterface } from './user-controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserSerivceInterface } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements UsersControllerInterface {
    constructor(
        @inject(TYPES.LoggerInterface) private readonly loggerService: LoggerInterface,
        @inject(TYPES.UserSerivceInterface) private readonly userService: UserSerivceInterface,
    ) {
        super(loggerService);
        const userRoutes: ControllerRouteInterface[] = [
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
            },
        ];
        this.bindRoutes(userRoutes);
    }

    async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const user = await this.userService.createUser(body);
        if (user === null) {
            return next(new HttpError(422, 'Пользователь уже существует', 'register'));
        }
        this.send(res, 201, { id: user.id, email: user.email });
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        this.loggerService.log(req.body);
        next(new HttpError(401, 'Ошибка авторизации', 'login'));
    }
}
