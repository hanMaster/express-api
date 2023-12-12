import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

export interface UserSerivceInterface {
    createUser: (dto: UserRegisterDto) => Promise<User | null>;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
