import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('bigBasket_user');

  if (token) {
    return true;
  } else {
    router.navigateByUrl('/AllProducts');
    return false;
  }
};
