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
  startDate: string = '';
  endDate: string = ''; 
  averageDefended: number | null = null; 
  approvedReviewsCount: number | null = null; 
  errorMessage: string | null = null; 
  isLoading: boolean = false;

  constructor(private reviewService: ReviewService, private defenseService: DefenseService) {}

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

  clearResults(): void {
    this.startDate = '';
    this.endDate = '';
    this.averageDefended = null;
    this.approvedReviewsCount = null;
    this.errorMessage = null;
  }
}