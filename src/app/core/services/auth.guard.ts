import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

export const authGuard = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();

  if (token) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};
