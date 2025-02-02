import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThesisService } from '../../services/thesis.service';
import { ReviewService } from '../../services/review.service'; // Service to fetch review details
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { DefenseService } from '../../services/defense.service';
import { ResultService } from '../../services/result.service';
import { DiplomaDefense } from '../../models/defense-result';

@Component({
  selector: 'app-thesis-details',
  templateUrl: './thesis-details.component.html',
  styleUrls: ['./thesis-details.component.css'],
  standalone: false,
})
export class ThesisDetailsComponent implements OnInit {
  thesis: any = null; // Holds the thesis details
  review: any = null; // Holds the review details
  errorMessage: string | null = null; // Error message for display
  editing: boolean = false; // Toggle edit form
  defenses: DiplomaDefense[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private thesisService: ThesisService,
    private reviewService: ReviewService, // Inject ReviewService
    private defenseService: DefenseService,
    public authService: AuthService,
    private location: Location,
    private resultService: ResultService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.initializeDetails();
    } catch (error) {
      console.error('Error during initialization:', error);
      this.errorMessage = 'An error occurred while loading details.';
    }
  }



  // Initialize the details by fetching the thesis, review, and defenses
  async initializeDetails(): Promise<void> {
    const thesisId = this.route.snapshot.paramMap.get('id');
    if (!thesisId) {
      this.errorMessage = 'No thesis ID provided in the URL.';
      return;
    }

    try {
      await this.fetchThesisDetails(+thesisId);
      if (this.thesis.reviewId) {
        await this.fetchReviewDetails(this.thesis.reviewId);
      }
      await this.fetchDefenses(+thesisId);
    } catch (error) {
      console.error('Error during detail initialization:', error);
      throw error;
    }
  }

  // Fetch thesis details using the ID
  fetchThesisDetails(thesisId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.thesisService.getThesisById(thesisId).subscribe(
        (data) => {
          this.thesis = data;
          console.log('Thesis details:', data);
          this.errorMessage = null;
          resolve();
        },
        (error) => {
          console.error('Error fetching thesis details:', error);
          this.errorMessage = 'Thesis not found or failed to load.';
          reject(error);
        }
      );
    });
  }

  // Fetch review details by reviewId
  fetchReviewDetails(reviewId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reviewService.getReviewById(reviewId).subscribe(
        (data) => {
          this.review = data;
          console.log('Review details:', data);
          resolve();
        },
        (error) => {
          console.error('Error fetching review details:', error);
          this.review = null;
          reject(error);
        }
      );
    });
  }

  // Fetch all defenses for the thesis
  fetchDefenses(thesisId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.defenseService.getDefensesByThesisId(thesisId).subscribe(
        async (data) => {
          this.defenses = data;
          console.log(data);
  
          // Fetch results for defenses with a resultId
          const fetchResultPromises = this.defenses.map((defense) => {
            if (defense.resultId) {
              return this.resultService.getDefenseResultById(Number(defense.resultId)).toPromise().then(
                (result) => {
                  defense.result = result; // Attach the result to the defense
                },
                (error) => {
                  console.warn(`Failed to fetch result for defense ${defense.id}`);
                  defense.result = null; // Ensure result is null if not found
                }
              );
            } else {
              defense.result = null; // No resultId, set result to null
              return Promise.resolve();
            }
          });
  
          await Promise.all(fetchResultPromises); // Wait for all result fetches
          resolve();
        },
        (error) => {
          console.error('Error fetching defenses:', error);
          reject(error);
        }
      );
    });
  }


  

  // Delete the thesis
  deleteThesis(): void {
    if (confirm('Are you sure you want to delete this thesis?')) {
      this.thesisService.deleteThesis(this.thesis.id).subscribe(
        () => {
          alert('Thesis deleted successfully!');
          this.router.navigate(['/dashboard']); // Redirect back to the dashboard
        },
        (error) => {
          console.error('Error deleting thesis:', error);
          alert('Failed to delete thesis. Please try again.');
        }
      );
    }
  }

  goToReviewDetails(): void {
    if (this.thesis.reviewId) {
      this.router.navigate(['/reviews', this.thesis.reviewId]);
    }
  }

  canEditThesis(): boolean {
    if (
      !this.thesis ||
      this.thesis.studentKeycloakId == null ||
      this.thesis.reviewId != null
    ) {
      return false;
    }

    return (
      this.authService.hasRole('student') &&
      this.thesis.studentKeycloakId === (this.authService.getUserId() ?? '')
    );
  }

  goToReviewSubmission(): void {
    this.router.navigate([`/reviews/submit`], {
      queryParams: { thesisId: this.thesis.id },
    });
  }

  goToSubmitDefense(): void {
    this.router.navigate(['/defense/submit'], {
      queryParams: { thesisId: this.thesis.id },
    });
  }

  canSubmitDefense(): boolean {
    if (!this.thesis || !this.review) return false;
    const currentUserKeycloakId = this.authService.getUserId();


    return (
      this.authService.hasRole('teacher') &&
      this.thesis.teacherKeycloakId !== currentUserKeycloakId &&
      this.review.positive
    );
  }

  canSubmitReview(): boolean {
    if (!this.thesis) return false;

    if (this.thesis.reviewId) return false;
    const currentUserKeycloakId = this.authService.getUserId();

    // Ensure the user is a teacher and not the supervisor
    return (
      this.authService.hasRole('teacher') &&
      this.thesis.teacherKeycloakId !== currentUserKeycloakId
    );
  }

  // Toggle the edit form visibility
  toggleEdit(): void {
    this.editing = !this.editing;
  }

  fetchResult(defense: any): void {
    this.resultService.getDefenseResultById(defense.id).subscribe(
      (result) => {
        defense.result = result; // Attach the result to the defense
      },
      (error) => {
        console.warn(`No result found for defense ${defense.id}.`);
      }
    );
  }

  // Update thesis
  updateThesis(): void {
    this.thesisService.updateThesis(this.thesis.id, this.thesis).subscribe(
      (updatedThesis) => {
        alert('Thesis updated successfully!');
        this.thesis = updatedThesis; // Update local thesis data
        this.editing = false; // Close the edit form
      },
      (error) => {
        console.error('Error updating thesis:', error);
        alert('Failed to update thesis. Please try again.');
      }
    );
  }

  canManageDefense(defense: any): boolean {
    const currentUserId = this.authService.getUserId();
    return (
      this.authService.hasRole('admin') ||
      (this.authService.hasRole('teacher') && defense.supervisorKeycloakId === currentUserId)
    );
  }

  // Add or update result
  addOrUpdateResult(defense: any): void {
    const grade = prompt('Enter the grade for the defense:', defense.grade || '');
    if (grade) {
      const data = { grade: parseFloat(grade), defenseId: defense.id };
      if (defense.grade) {
        // Update existing result
        this.resultService.updateDefenseResult(defense.id, { grade: parseFloat(grade) }).subscribe(
          () => {
            alert('Result updated successfully!');
            this.fetchDefenses(this.thesis.id); // Refresh the defenses
          },
          (error) => {
            console.error('Error updating result:', error);
            alert('Failed to update result. Please try again.');
          }
        );
      } else {
        // Create new result
        this.resultService.createDefenseResult(data).subscribe(
          () => {
            alert('Result added successfully!');
            this.fetchDefenses(this.thesis.id); // Refresh the defenses
          },
          (error) => {
            console.error('Error adding result:', error);
            alert('Failed to add result. Please try again.');
          }
        );
      }
    }
  }

  // Delete result
  deleteResult(defense: any): void {
    if (confirm('Are you sure you want to delete the result?')) {
      this.defenseService.deleteDefense(defense.id).subscribe(
        () => {
          alert('Result deleted successfully!');
          this.fetchDefenses(this.thesis.id); // Refresh the defenses
        },
        (error) => {
          console.error('Error deleting result:', error);
          alert('Failed to delete result. Please try again.');
        }
      );
    }
  }


  // Navigate back to the previous page
  backToPreviousPage(): void {
    this.location.back(); // Use Location service to navigate back
  }
}