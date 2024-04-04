import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

interface RoleRouteData {
  role: string[];
}


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const data = route.data as RoleRouteData;
    const requiredRoles = data.role;
    console.log('requiredRoles ',requiredRoles)

    if (!this.authService.isAuthenticated()) {
      console.log('Lece do /login')
      this.router.navigate(['/profile-authentication']);
      return false;
    }

    const hasRequiredRole = requiredRoles.some(role => this.authService.hasRole(role));
    console.log('hasRequiredRole ',hasRequiredRole)
    if (!hasRequiredRole) {
      console.log('NIE PPOSIADA ROLI')
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}