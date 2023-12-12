import { Router, Response } from 'express';
import { injectable } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface';
import { ControllerRouteInterface, ExpressReturnType } from './route.interface';

@injectable()
export abstract class BaseController {
    private readonly _router: Router;

    constructor(private readonly logger: LoggerInterface) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    public created(res: Response): ExpressReturnType {
        return res.sendStatus(201);
    }

    public send<T>(res: Response, code: number, message: T): ExpressReturnType {
        res.type('application/json');
        res.status(code);
        return res.json(message);
    }

    public ok<T>(res: Response, message: T): ExpressReturnType {
        return this.send<T>(res, 200, message);
    }

    protected bindRoutes(routes: ControllerRouteInterface[]): void {
        routes.forEach((r) => {
            this.logger.log(`[${r.method}] ${r.path}`);
            const middlewares = r.middlewares?.map((m) => m.execute.bind(m));
            const handler = r.func.bind(this);
            const pipeline = middlewares ? [...middlewares, handler] : handler;
            this._router[r.method](r.path, pipeline);
        });
    }
}
