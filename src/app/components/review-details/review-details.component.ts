import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth.service';
import { ThesisService } from '../../services/thesis.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css'],
  standalone: false
})
export class ReviewDetailsComponent implements OnInit {
  review: any = null; // Holds the review details
  thesis: any = null;
  editing: boolean = false; // Controls visibility of the edit form

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private authService: AuthService,
    private thesisService: ThesisService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initializeDetails();
  }
  
  async initializeDetails(): Promise<void> {
    try {
      await this.fetchReviewDetails();
      this.fetchThesisDetails();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
  
  // Fetch review details using the ID from route parameters
  fetchReviewDetails(): Promise<void> {
    const reviewId = this.route.snapshot.paramMap.get('id');
    if (!reviewId) {
      return Promise.reject('No review ID provided in the URL.');
    }
  
    return new Promise((resolve, reject) => {
      this.reviewService.getReviewById(+reviewId).subscribe(
        (data) => {
          this.review = data;
          console.log(data);
          resolve(); // Resolve when the review is fetched
        },
        (error) => {
          console.error('Error fetching review details:', error);
          reject(error); // Reject if an error occurs
        }
      );
    });
  }

  fetchThesisDetails(): void {
    const thesisId = this.review.thesisId;
    if (thesisId) {
      this.thesisService.getThesisById(+thesisId).subscribe(
        (data) => {
          this.thesis = data;
          console.log(data)
        },
        (error) => {
          console.error('Error fetching thesis details:', error);
        }
      );
    } 
  }

  // Check if the current user can edit the review
  canEditReview(): boolean {
    if (!this.review) return false;
    const currentUserKeycloakId = this.authService.getUserId();
    return (
      this.authService.hasRole('teacher') &&
      this.review.teacherKeycloakId === currentUserKeycloakId
    );
  }


  canResubmitReview(): boolean {
    if (!this.review) return false;

    if (this.review.positive) return false;

    const currentUserKeycloakId = this.authService.getUserId();
    return (
      this.authService.hasRole('student') &&
      this.thesis.studentKeycloakId === currentUserKeycloakId
    );
  }

  // Toggle the edit form visibility
  toggleEdit(): void {
    this.editing = !this.editing;
  }

  // Update the review
  updateReview(): void {
    this.reviewService.updateReview(this.review.id, this.review).subscribe(
      (updatedReview) => {
        alert('Review updated successfully!');
        this.review = updatedReview; // Update the review details
        this.editing = false; // Close the edit form
      },
      (error) => {
        console.error('Error updating review:', error);
        alert('Failed to update review. Please try again.');
      }
    );
  }

  // Navigate back to the previous page
  backToPreviousPage(): void {
    this.location.back(); // Use Location service to navigate back
  }

  // Navigate to the thesis resubmission page
  goToThesisResubmission(): void {
    
    this.router.navigate(['/theses/submit'], {
      queryParams: { assignmentId: this.thesis.assignmentId },
    });
  }
}