import { UserModel } from '@prisma/client';
import { User } from './user.entity';
import { UserRepositoryInterface } from './user.repository.interface';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';

@injectable()
export class UserRepository implements UserRepositoryInterface {
    model = this.prismaService.client.userModel;
    constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}

    async create({ email, password, name }: User): Promise<UserModel> {
        return this.model.create({
            data: {
                email,
                password,
                name,
            },
        });
    }

    async find(email: string): Promise<UserModel | null> {
        return this.model.findFirst({
            where: {
                email,
            },
        });
    }
}
