import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-review-submission',
  templateUrl: './review-submission.component.html',
  styleUrls: ['./review-submission.component.css'],
  standalone: false
})
export class ReviewSubmissionComponent implements OnInit {
  review: any = {
    text: '',
    positive: null,
    uploadDate: new Date(),
    teacherId: null,
    thesisId: null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.review.thesisId = +params['thesisId'];
    });

    this.authService
      .getTeacherByKeycloakId(this.authService.getUserId() || '')
      .subscribe((teacher) => {
        this.review.teacherId = teacher.id;
      });
  }

  submitReview(): void {
    this.reviewService.createReview(this.review).subscribe(
      () => {
        alert('Review submitted successfully!');
        this.router.navigate(['/thesis', this.review.thesisId]);
      },
      (error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/assignments', this.review.assignmentId]);
  }
}
