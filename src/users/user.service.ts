import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserSerivceInterface } from './user.service.interface';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserModel } from '@prisma/client';
import { hash } from 'bcryptjs';

@injectable()
export class UserService implements UserSerivceInterface {
    private readonly saltLength: number;
    constructor(
        @inject(TYPES.ConfigServiceInterface) private configService: ConfigServiceInterface,
        @inject(TYPES.UserRepositoryInterface) private userRepo: UserRepositoryInterface,
    ) {
        this.saltLength = Number(this.configService.get('SALT'));
    }
    async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
        const saved = await this.userRepo.find(email);
        if (saved) {
            return null;
        }
        const newUser = new User(email, name);
        await newUser.setPassword(password, this.saltLength);
        return this.userRepo.create(newUser);
    }

    async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
        const user = await this.userRepo.find(email);
        if (user) {
            const newUser = User.fromUserModel(user);
            return newUser.validatePassword(password);
        }
        return false;
    }
}
