import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { ExceptionFilterInterface } from './exception.filter.interface';
import { HttpError } from './http-error';
import { TYPES } from '../types';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
    constructor(@inject(TYPES.LoggerInterface) private readonly logger: LoggerInterface) {}

    catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
        if (err instanceof HttpError) {
            this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send({ err: err.message });
        } else {
            this.logger.error(`${err.message}`);
            res.status(500).send({ err: err.message });
        }
    }
}
