import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
  data: T;
}

/**
 * The NestInterceptor<T, R> is a generic interface
 * in which T indicates the type of an Observable<T>
 * (supporting the response stream),
 * and R is the type of the value wrapped by Observable<R>.
 */

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
