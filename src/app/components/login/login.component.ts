import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  token: string | null = null;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.route.snapshot.url[0]?.path === 'login') {
      this.router.navigate(['/dashboard']);
    }
    
  }

  login(): void {

    this.authService.clearToken()
    this.authService.login(this.credentials).subscribe(
      (token) => {
        this.authService.storeToken(token); 
        this.error = null;
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        this.error = 'Invalid username or password'; 
        console.error('Login error:', err);
      }
    );
  }
}