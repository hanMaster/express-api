import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { ConfigServiceInterface } from './config.service.interface';
import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { TYPES } from '../types';

@injectable()
export class ConfigService implements ConfigServiceInterface {
    private parsed: DotenvParseOutput;
    constructor(@inject(TYPES.LoggerInterface) private logger: LoggerInterface) {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error('[ConfigService] Не удалось прочитать конфиг');
        } else {
            this.parsed = result.parsed as DotenvParseOutput;
            this.logger.log('[ConfigService] Загружен конфиг');
        }
    }
    get(key: string): string {
        return this.parsed[key];
    }
}
