import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access if authenticated', () => {
    authService.getToken.and.returnValue('fake-token'); // Mock token existence
    expect(authGuard.canActivate()).toBe(true); // Guard should allow access
    expect(router.navigate).not.toHaveBeenCalled(); // Ensure no navigation occurs
  });

  it('should redirect to login if not authenticated', () => {
    authService.getToken.and.returnValue(null); // Mock no token
    expect(authGuard.canActivate()).toBe(false); // Guard should block access
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Ensure redirection
  });
});