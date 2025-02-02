import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
  standalone: false
})
export class AssignmentComponent implements OnInit {
  assignments: any[] = [];
  selectedAssignment: any = null;
  errorMessage: string | null = null;
  searchInput: string = '';
  searchType: string = 'topic';
  isLoading = false;

  constructor(private assignmentService: AssignmentService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAssignments();
  }

  fetchAssignments(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.assignmentService.getAllAssignments().subscribe(
      (data) => {
        this.assignments = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching assignments';
        this.isLoading = false;
      }
    );
  }

  searchAssignments(): void {
    if (this.searchInput.trim()) {
      this.isLoading = true;
      if (this.searchType === 'topic') {
        this.assignmentService.getAllAssignmentsByTopic(this.searchInput).subscribe(
          (data) => {
            this.assignments = data;
            this.errorMessage = null;
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'No assignments found with this topic.';
            this.assignments = [];
            this.isLoading = false;
          }
        );
      } else if (this.searchType === 'teacher') {
        this.assignmentService.getAllAssignmentsByTeacher(this.searchInput).subscribe(
          (data) => {
            this.assignments = data;
            this.errorMessage = null;
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = 'No assignments found for this teacher.';
            this.assignments = [];
            this.isLoading = false;
          }
        );
      }
    } else {
      this.fetchAssignments();
    }
  }

  clearSearch(): void {
    this.searchInput = '';
    this.fetchAssignments();
  }

  redirectToAssignmentDetails(assignmentId: number): void {
    this.router.navigate([`/assignments/${assignmentId}`]);
  }

  getStatusClass(assignment: any): string {
    if (!assignment) return '';
  
    if (!assignment.approved) return 'status-not-approved';
    if (assignment.approved && !assignment.hasThesis) return 'status-pending-thesis';
    if (assignment.approved && assignment.hasThesis && !assignment.thesisReviewed) return 'status-pending-review';
    if (
      assignment.approved &&
      assignment.hasThesis &&
      assignment.thesisReviewed &&
      assignment.positiveReview === false
    )
      return 'status-review-failed';
    if (
      assignment.approved &&
      assignment.hasThesis &&
      assignment.thesisReviewed &&
      assignment.positiveReview &&
      !assignment.hasDefense
    )
      return 'status-pending-defense';
    if (
      assignment.approved &&
      assignment.hasThesis &&
      assignment.thesisReviewed &&
      assignment.positiveReview &&
      assignment.hasDefense &&
      assignment.defenseGrade !== null
    )
      return 'status-completed';
  
    return 'status-unknown';
  }


  getStatusMessage(assignment: any): string {
    if (!assignment) return 'Unknown';
  
    if (!assignment.approved) return 'Not Approved';
    if (assignment.approved && !assignment.hasThesis) return 'Pending Thesis';
    if (assignment.approved && assignment.hasThesis && !assignment.thesisReviewed) return 'Pending Review';
    if (
      assignment.approved &&
      assignment.hasThesis &&
      assignment.thesisReviewed &&
      assignment.positiveReview === false
    )
      return 'Review Failed';
    if (
      assignment.approved &&
      assignment.hasThesis &&
      assignment.thesisReviewed &&
      assignment.positiveReview &&
      !assignment.hasDefense
    )
      return 'Pending Defense';
    if (
      assignment.approved &&
      assignment.hasThesis &&
      assignment.thesisReviewed &&
      assignment.positiveReview &&
      assignment.hasDefense &&
      assignment.defenseGrade !== null
    )
      return 'Completed';
  
    return 'Unknown';
  }

  sortAssignments(field: string): void {
    if (field === 'topic') {
      this.assignments.sort((a, b) => a.topic.localeCompare(b.topic));
    } else if (field === 'status') {
      this.assignments.sort((a, b) => {
        const statusA = this.getStatusMessage(a);
        const statusB = this.getStatusMessage(b);
        return statusA.localeCompare(statusB);
      });
    }
  }

  toggleSelection(assignment: any): void {
    if (this.selectedAssignment?.id === assignment.id) {
      this.selectedAssignment = null;
    } else {
      this.selectedAssignment = assignment;
    }
  }
}
