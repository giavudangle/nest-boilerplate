import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { recursivelyStripNullValues } from '../helpers/recursively-strip-null-values.helper';
import { map } from 'rxjs/operators';
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return (
      next
        .handle()
        // .pipe(map(value => value === null ? '' : value ));
        //.pipe(map(value => console.log(value)))
        .pipe(map((value) => recursivelyStripNullValues(value)))
    );
  }
}
