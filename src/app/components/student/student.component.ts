import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { UserService } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  standalone: false
})
export class StudentComponent implements OnInit {
  students: any[] = []; 
  selectedStudent: any = null;
  errorMessage: string | null = null;
  searchType: string = 'name';
  searchInput: string = ''; 
  isLoading = false;
  searchQuery: string = ''; 
  startDate: string = ''; 
  endDate: string = '';

  constructor(
    private studentService: StudentService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
  }
  fetchStudents(): void {
    this.isLoading = true;
    if (this.searchQuery !== '' || (this.startDate && this.endDate)) return;
    this.errorMessage = null;
    this.studentService.getAllStudents().subscribe(
      (data) => {
        this.students = data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error fetching students';
        this.isLoading = false;
      }
    );
  }

  searchStudents(): void {
    if (this.searchType === 'name' && this.searchQuery.trim()) {
      this.studentService.getStudentByName(this.searchQuery).subscribe(
        (data) => {
          this.students = data;
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        (error) => {
          this.errorMessage = 'No student found with this name.';
          this.students = [];
        }
      );
    } else if (this.searchType === 'facultyNumber' && this.searchQuery.trim()) {
      this.studentService.getStudentByFacultyNumber(this.searchQuery).subscribe(
        (data) => {
          this.students = [data];
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        (error) => {
          this.errorMessage = 'No student found with this faculty number.';
          this.students = [];
        }
      );
    } else if (this.searchType === 'dates' && this.startDate && this.endDate) {
      this.studentService
        .getStudentsWhoPassedBetweenDates(this.startDate, this.endDate)
        .subscribe(
          (data) => {
            this.students = data;
            this.errorMessage = null; 
            this.cdr.detectChanges();
          },
          (error) => {
            this.errorMessage =
              'No students found who passed between the selected dates.';
            this.students = [];
          }
        );
    } else {
      this.fetchStudents();
    }
  }
  clearSearch(): void {
    this.searchInput = '';
    this.endDate = '';
    this.startDate = '';
    this.fetchStudents(); 
  }

  updateStudent(): void {
    if (this.selectedStudent) {
      this.studentService
        .updateStudent(this.selectedStudent.id, this.selectedStudent)
        .subscribe(
          (updatedStudent) => {
            const index = this.students.findIndex(
              (student) => student.id === updatedStudent.id
            );
            if (index !== -1) {
              this.students[index] = updatedStudent;
            }
            this.selectedStudent = null; 
          },
          (error) => {
            console.error(error);
            this.errorMessage = 'Error updating student';
          }
        );
    }
    this.cdr.detectChanges();
  }

  redirectToAssignmentCreation(studentId: number): void {
    this.router.navigate(['/assignments/create'], { queryParams: { studentId } });
  }

  redirectToAssignmentDetails(assignmentId: number): void {
    this.router.navigate([`/assignments/${assignmentId}`]);
  }

  deleteStudent(): void {
    if (this.selectedStudent) {
      const keycloakId = this.selectedStudent.keycloakUserId;

      this.userService.deleteUser(keycloakId).subscribe({
        next: () => {
          this.students = this.students.filter(
            (student) => student.keycloakUserId !== keycloakId
          );

          this.selectedStudent = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Failed to delete student. Please try again.');
        },
      });
    }
  }
  toggleSelection(student: any): void {
    this.selectedStudent = student;
}
}
