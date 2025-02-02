import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'DimplomaSite-Frontend';
  showLayout: boolean = true;
  userName: any = null;

  constructor(private authService: AuthService, private router: Router) {
    // Listen to route changes and toggle the layout
    this.router.events.subscribe(() => {
      this.showLayout = this.router.url !== '/login'; // Hide layout for the login page
    });
  }

  ngOnInit(): void {
    this.userName = this.authService.getUserNameFromToken(); // Fetch username from token
  }
  logout(): void {
    
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}
