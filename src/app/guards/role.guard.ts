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
    // Suppose the route data contains the roles needed:
    const expectedRoles = route.data['roles'] as string[]; // e.g. ["ADMIN", "MANAGER"]

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has at least one of the required roles
    const userRoles = this.authService.getUserRoles(); // from your AuthService
    const hasRole = expectedRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      // user does not have the required role(s)
      // Optionally redirect them somewhere or show "Access Denied"

      this.router.navigate(['/access-denied']);
      console.log(userRoles);
      return false;
    }

    return true;
  }
}