import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from "@nestjs/common";
import { logger } from "@src/config/modules/winston";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { url, method } = context.switchToHttp().getRequest();

        logger.info(`[liqudity] [${method}] [${url}] Before...`);

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() =>
                    logger.info(
                        `[liqudity] [${method}] [${url}] After... ${
                            Date.now() - now
                        }ms`
                    )
                )
            );
    }
}
