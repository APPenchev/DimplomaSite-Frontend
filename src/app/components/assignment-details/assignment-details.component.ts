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
  assignment: any = null; 
  defenses: any[] = []; 
  errorMessage: string | null = null; 
  editing: boolean = false; 
  teacher: any = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private assignmentService: AssignmentService,
    private defenseService: DefenseService, 
    public authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.fetchAssignmentDetails();
    this.authService
      .getTeacherByKeycloakId(this.authService.getUserId() || '')
      .subscribe((teacher) => {
        this.teacher = teacher; 
      });
  }

  
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
        this.assignment.approved = true; 
      },
      (error) => {
        console.error('Error approving assignment:', error);
        alert('Failed to approve assignment.');
      }
    );
  }

  canEditAssignment(): boolean {
    if (!this.assignment) return false;

    if (this.authService.hasRole('admin')) return true;

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

    if (this.authService.hasRole('admin')) return true;

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
          this.assignment = updatedAssignment;
          this.editing = false;
        },
        (error) => {
          console.error('Error updating assignment:', error);
          alert('Failed to update assignment. Please try again.');
        }
      );
  }

  backToPreviousPage(): void {
    this.location.back();
  }
}
