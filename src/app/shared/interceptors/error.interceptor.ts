import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((error: any) => {
    if ([401, 403, 404].includes(error.status)) {
      console.log('Unauthorized request');
    }
    console.error(error.message);
    return throwError(() => error);
  })
  );
};
