import { Component } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { DefenseService } from '../../services/defense.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: false
})
export class AdminComponent {
  startDate: string = ''; // Start date for defense query
  endDate: string = ''; // End date for defense query
  averageDefended: number | null = null; // Result for average defended students
  approvedReviewsCount: number | null = null; // Result for approved reviews count
  errorMessage: string | null = null; // For handling errors
  isLoading: boolean = false;

  constructor(private reviewService: ReviewService, private defenseService: DefenseService) {}

  // Fetch average number of students defended between dates
  fetchAverageDefended(): void {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Please select both start and end dates.';
      return;
    }

    this.isLoading = true;
    this.defenseService.getAverageDefendedBetweenDates(this.startDate, this.endDate).subscribe(
      (average) => {
        this.averageDefended = average;
        this.errorMessage = null;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching average defended:', error);
        this.errorMessage = 'Error fetching average defended.';
        this.isLoading = false;
      }
    );
  }

  // Fetch count of approved reviews
  fetchApprovedReviewsCount(): void {
    this.isLoading = true;
    this.reviewService.getApprovedReviewsCount().subscribe(
      (count) => {
        this.approvedReviewsCount = count;
        this.errorMessage = null;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching approved reviews count:', error);
        this.errorMessage = 'Error fetching approved reviews count.';
        this.isLoading = false;
      }
    );
  }

  // Clear results and error messages
  clearResults(): void {
    this.startDate = '';
    this.endDate = '';
    this.averageDefended = null;
    this.approvedReviewsCount = null;
    this.errorMessage = null;
  }
}