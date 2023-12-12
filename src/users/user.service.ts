import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserSerivceInterface } from './user.service.interface';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { TYPES } from '../types';

@injectable()
export class UserService implements UserSerivceInterface {
    private readonly saltLength: number;
    constructor(@inject(TYPES.ConfigServiceInterface) private configService: ConfigServiceInterface) {
        this.saltLength = Number(this.configService.get('SALT'));
    }
    async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
        const newUser = new User(email, name);
        await newUser.setPassword(password, this.saltLength);
        return newUser;
    }

    async validateUser(dto: UserLoginDto): Promise<boolean> {
        return true;
    }
}
