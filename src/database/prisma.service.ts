import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { LoggerInterface } from '../logger/logger.interface';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.LoggerInterface) private logger: LoggerInterface) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] Подключились к базе данных');
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`[PrismaService] Ошибка подключения к базе данных: ${e.message}`);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
        this.logger.log('Отключились от базы данных');
    }
}
