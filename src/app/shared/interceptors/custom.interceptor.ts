import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const bigBasketToken = sessionStorage.getItem('token');
  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${bigBasketToken}`
    }
  });
  return next(cloneRequest);
};
