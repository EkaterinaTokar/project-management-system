import {inject} from '@angular/core';
import { CanActivateFn} from '@angular/router';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated()
  if (!isAuthenticated) {
    router.navigate(['/home']);
  }
  return isAuthenticated;
};
