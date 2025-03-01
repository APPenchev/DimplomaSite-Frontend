import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service'

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const expectedRoles = route.data['roles'] as string[]; // e.g. ["ADMIN", "MANAGER"]


    if (!this.authService.isAuthenticated()) {
      
      this.router.navigate(['/login']);
      return false;
    }

    const userRoles = this.authService.getUserRoles();
    const hasRole = expectedRoles.some(role => userRoles.includes(role));
    if (!hasRole) {

      this.router.navigate(['/access-denied']);
      console.log(userRoles);
      return false;
    }

    return true;
  }
}