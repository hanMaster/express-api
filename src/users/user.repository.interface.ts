import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export interface UserRepositoryInterface {
    create: (user: User) => Promise<UserModel>;
    find: (email: string) => Promise<UserModel | null>;
}
