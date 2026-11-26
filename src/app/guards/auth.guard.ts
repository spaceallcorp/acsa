// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export class AuthGuard {
  static canActivate: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true; // Acesso permitido
        } else {
          router.navigate(['/login']);
          return false; // Bloqueado
        }
      })
    );
  };
}
