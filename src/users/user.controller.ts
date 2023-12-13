import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
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
import { ConfigService } from '../config/config.service';
import { UserInfoDto } from './dto/user-info.dto';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements UsersControllerInterface {
    constructor(
        @inject(TYPES.LoggerInterface) private readonly loggerService: LoggerInterface,
        @inject(TYPES.UserSerivceInterface) private readonly userService: UserSerivceInterface,
        @inject(TYPES.ConfigServiceInterface) private readonly configService: ConfigService,
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
                middlewares: [new ValidateMiddleware(UserLoginDto)],
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new AuthGuard()],
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

    async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const isValid = await this.userService.validateUser(body);
        if (!isValid) {
            return next(new HttpError(401, 'Ошибка авторизации', 'login'));
        }
        const jwt = await this.signJwt(body.email, this.configService.get('JWT_SECRET'));
        this.ok(res, { authenticated: true, jwt });
    }

    async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
        const dbUser = await this.userService.getUserInfo(user);
        this.ok(res, { id: dbUser?.id, name: dbUser?.name, email: dbUser?.email });
    }

    private async signJwt(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                },
                (err, token) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(token as string);
                },
            );
        });
    }
}
