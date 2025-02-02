import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { DefenseService } from '../../services/defense.service'; // Add DefenseService
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-assignment-details',
  templateUrl: './assignment-details.component.html',
  styleUrls: ['./assignment-details.component.css'],
  standalone: false,
})
export class AssignmentDetailsComponent implements OnInit {
  assignment: any = null; // Holds the assignment details
  defenses: any[] = []; // Holds defenses for the thesis
  errorMessage: string | null = null; // Error message for display
  editing: boolean = false; // Toggle edit form
  teacher: any = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private assignmentService: AssignmentService,
    private defenseService: DefenseService, // Add DefenseService
    public authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchAssignmentDetails();
    this.authService
      .getTeacherByKeycloakId(this.authService.getUserId() || '')
      .subscribe((teacher) => {
        this.teacher = teacher; // Store the TeacherDto
      });
  }

  // Fetch assignment details using the ID from route parameters
  fetchAssignmentDetails(): void {
    const assignmentId = this.route.snapshot.paramMap.get('id');
    if (assignmentId) {
      this.assignmentService.getAssignmentById(+assignmentId).subscribe(
        (data) => {
          this.assignment = data;
          this.errorMessage = null;

          
        },
        (error) => {
          console.error('Error fetching assignment details:', error);
          this.errorMessage = 'Assignment not found or failed to load.';
        }
      );
    } else {
      this.errorMessage = 'No assignment ID provided in the URL.';
    }
  }


  // Delete the assignment
  deleteAssignment(): void {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignmentService.deleteAssignment(this.assignment.id).subscribe(
        () => {
          alert('Assignment deleted successfully!');
          this.router.navigate(['/students']); // Redirect back to the students page
        },
        (error) => {
          console.error('Error deleting assignment:', error);
          alert('Failed to delete assignment. Please try again.');
        }
      );
    }
  }

  approveAssignment(): void {
    this.assignmentService.approveAssignment(this.assignment.id).subscribe(
      () => {
        alert('Assignment approved successfully!');
        this.assignment.approved = true; // Update the UI to reflect approval
      },
      (error) => {
        console.error('Error approving assignment:', error);
        alert('Failed to approve assignment.');
      }
    );
  }

  canEditAssignment(): boolean {
    if (!this.assignment) return false;

    // Admins can always edit
    if (this.authService.hasRole('admin')) return true;

    // Supervising teacher can edit (compare teacher.id with assignment.supervisorId)
    return (
      this.authService.hasRole('teacher') &&
      this.teacher?.id === this.assignment.supervisorId
    );
  }

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  canApproveAssignment(): boolean {
    if (!this.assignment) return false;
    if (this.assignment.approved) return false;

    // Admins can always approve
    if (this.authService.hasRole('admin')) return true;

    // Other teachers can approve if they are not the supervisor
    return (
      this.authService.hasRole('teacher') &&
      this.teacher?.id !== this.assignment.supervisorId
    );
  }

  navigateToThesis(): void {
    if (this.assignment?.thesisId) {
      this.router.navigate([`/theses/${this.assignment.thesisId}`]);
    }
  }

  updateAssignment(): void {
    this.assignmentService
      .updateAssignment(this.assignment.id, this.assignment)
      .subscribe(
        (updatedAssignment) => {
          alert('Assignment updated successfully!');
          this.assignment = updatedAssignment; // Update local assignment data
          this.editing = false; // Close the edit form
        },
        (error) => {
          console.error('Error updating assignment:', error);
          alert('Failed to update assignment. Please try again.');
        }
      );
  }

  backToPreviousPage(): void {
    this.location.back(); // Use Location service to navigate back
  }
}
