import { inject } from '@angular/core';
import { 
  CanActivateFn, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      // Si l'utilisateur est connecté et essaie d'accéder à /login,
      // le rediriger vers le dashboard
      if (state.url === '/login' && user) {
        router.navigate(['/dashboard']);
        return false;
      }
      
      // Si l'utilisateur n'est pas connecté et essaie d'accéder à une autre route que /login,
      // le rediriger vers /login
      if (state.url !== '/login' && !user) {
        router.navigate(['/login']);
        return false;
      }

      return true;
    })
  );
};

export const noAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      // Si l'utilisateur est déjà connecté, le rediriger vers le dashboard
      if (user) {
        router.navigate(['/dashboard']);
        return false;
      }
      // Sinon, permettre l'accès à la page de login
      return true;
    })
  );
};