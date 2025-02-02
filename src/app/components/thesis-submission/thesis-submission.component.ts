import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThesisService } from '../../services/thesis.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-thesis-submission',
  templateUrl: './thesis-submission.component.html',
  styleUrls: ['./thesis-submission.component.css'],
  standalone: false
})
export class ThesisSubmissionComponent implements OnInit {
  thesis: any = {
    title: '',
    text: '',
    uploadDate: new Date(),
    assignmentId: null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private thesisService: ThesisService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the assignment ID from query params
    this.route.queryParams.subscribe((params) => {
      this.thesis.assignmentId = +params['assignmentId'];
      console.log('Assignment ID:', this.thesis.assignmentId);
    });
  }

  // Submit the thesis
  submitThesis(): void {
    this.thesisService.createThesis(this.thesis).subscribe(
      () => {
        alert('Thesis submitted successfully!');
        this.router.navigate(['/dashboard', this.thesis.assignmentId]);
      },
      (error) => {
        console.error('Error submitting thesis:', error);
        alert('Failed to submit thesis. Please try again.');
      }
    );
  }

  // Cancel and go back
  cancel(): void {
    this.router.navigate(['/dashboard', this.thesis.assignmentId]);
  }
}
