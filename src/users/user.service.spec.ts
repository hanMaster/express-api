import 'reflect-metadata';
import { TYPES } from './../types';
import { Container } from 'inversify';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserSerivceInterface } from './user.service.interface';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: ConfigServiceInterface = {
    get: jest.fn(),
};

const UserRepoMock: UserRepositoryInterface = {
    create: jest.fn(),
    find: jest.fn(),
};

const container = new Container();
let configService: ConfigServiceInterface;
let userRepo: UserRepositoryInterface;
let userService: UserSerivceInterface;

beforeAll(() => {
    container.bind<UserSerivceInterface>(TYPES.UserSerivceInterface).to(UserService);
    container.bind<UserRepositoryInterface>(TYPES.UserRepositoryInterface).toConstantValue(UserRepoMock);
    container.bind<ConfigServiceInterface>(TYPES.ConfigServiceInterface).toConstantValue(ConfigServiceMock);

    configService = container.get<ConfigServiceInterface>(TYPES.ConfigServiceInterface);
    userRepo = container.get<UserRepositoryInterface>(TYPES.UserRepositoryInterface);
    userService = container.get<UserSerivceInterface>(TYPES.UserSerivceInterface);
});

const email = '1@2.com';
const badEmail = '11@2.com';
const password = '1qaz2wsx';
const badPassword = 'bad';
let createdUser: UserModel | null;

describe('User Service', () => {
    it('createUser', async () => {
        configService.get = jest.fn().mockReturnValueOnce(10);
        userRepo.create = jest.fn().mockImplementationOnce(
            (user: User): UserModel => ({
                id: 1,
                name: user.name,
                email: user.email,
                password: user.password,
            }),
        );
        createdUser = await userService.createUser({
            email,
            name: 'TestUser',
            password,
        });

        expect(createdUser?.id).toEqual(1);
        expect(createdUser?.password).not.toEqual('1qaz2wsx');
    });

    it('validateUser - invalid password', async () => {
        userRepo.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await userService.validateUser({ email, password: badPassword });
        expect(result).toBeFalsy();
    });

    it('validateUser - invalid user', async () => {
        userRepo.find = jest.fn().mockReturnValueOnce(null);
        const result = await userService.validateUser({ email: badEmail, password });
        expect(result).toBeFalsy();
    });

    it('validateUser - success', async () => {
        userRepo.find = jest.fn().mockReturnValueOnce(createdUser);
        const result = await userService.validateUser({ email, password });
        expect(result).toBeTruthy();
    });
});
