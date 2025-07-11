import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const abiVersion = process.env.API_VERSION ?? 'unknown';

    return next.handle().pipe(
      map((data): { abiVersion: string; data: unknown } => ({
        abiVersion,
        data,
      })),
    );
  }
}
