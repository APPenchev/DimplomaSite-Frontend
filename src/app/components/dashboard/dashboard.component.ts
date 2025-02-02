import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ThesisService } from '../../services/thesis.service';
import { AssignmentService } from '../../services/assignment.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  roles: string[] = [];
  assignment: any = null;
  thesis: any = null;
  isStudent: boolean = false;

  constructor(private authService: AuthService, private router: Router, private thesisService: ThesisService, private assignmentService: AssignmentService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      console.error('Token is invalid or expired. Redirecting to login.');
      this.authService.clearToken(); // Clear the expired token
      this.router.navigate(['/login']); // Redirect to login

    } else {
      this.roles = this.authService.getUserRoles();
      this.isStudent = this.authService.hasRole('student');
      console.log(this.isStudent)
      if (this.isStudent) {
        this.fetchStudentAssignment();
        console.log(this.assignment);
        this.fetchStudentThesis();
        console.log(this.thesis);
      }
    }

  }
  // Fetch the student's assignment
  fetchStudentAssignment(): void {
    this.assignmentService.getAssignmentByStudent().subscribe(
      (data) => {
        this.assignment = data;
      },
      (error) => {
        console.error('Error fetching assignment:', error);
      }
    );
  }

  // Fetch the student's thesis
  fetchStudentThesis(): void {
    this.thesisService.getThesisByStudent().subscribe(
      (data) => {
        this.thesis = data;
      },
      (error) => {
        console.error('Error fetching thesis:', error);
      }
    );
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  goToThesisSubmission(): void {
    this.router.navigate(['/theses/submit'], {
      queryParams: { assignmentId: this.assignment.id },
    });
  }

  goToThesisDetails(): void {
    if (this.thesis) {
      this.router.navigate(['/theses', this.thesis.id]);
    }
  }

  
  goToAssignmentDetails(): void {
    console.log(this.assignment)
    if (this.assignment) {
      this.router.navigate(['/assignments', this.assignment.id]);
    }
  }
  

}
