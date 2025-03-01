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
  
  fetchReviewDetails(): Promise<void> {
    const reviewId = this.route.snapshot.paramMap.get('id');
    if (!reviewId) {
      return Promise.reject('No review ID provided in the URL.');
    }
  
    return new Promise((resolve, reject) => {
      this.reviewService.getReviewById(+reviewId).subscribe(
        (data) => {
          this.review = data;
          resolve(); 
        },
        (error) => {
          console.error('Error fetching review details:', error);
          reject(error); 
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

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  updateReview(): void {
    this.reviewService.updateReview(this.review.id, this.review).subscribe(
      (updatedReview) => {
        alert('Review updated successfully!');
        this.review = updatedReview; 
        this.editing = false; 
      },
      (error) => {
        console.error('Error updating review:', error);
        alert('Failed to update review. Please try again.');
      }
    );
  }

  backToPreviousPage(): void {
    this.location.back(); 
  }

  goToThesisResubmission(): void {
    
    this.router.navigate(['/theses/submit'], {
      queryParams: { assignmentId: this.thesis.assignmentId },
    });
  }
}