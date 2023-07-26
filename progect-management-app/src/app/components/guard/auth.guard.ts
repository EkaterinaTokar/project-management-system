import {inject} from '@angular/core';
import {ActivatedRoute, CanActivateFn} from '@angular/router';
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";


export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //const route = inject (ActivatedRoute);
  const isAuthenticated = authService.isAuthenticated()
  if (!isAuthenticated) {
    router.navigate(['/login-form']);
  }
  return isAuthenticated;
};
