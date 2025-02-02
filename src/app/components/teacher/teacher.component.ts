import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { ChangeDetectorRef } from '@angular/core';
import { TeacherPosition } from '../../models/teacher-position.enum';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  standalone: false
})
export class TeacherComponent implements OnInit {
  teachers: any[] = []; // List of teachers
  selectedTeacher: any = null; // Currently selected teacher
  errorMessage: string | null = null;
  graduateCount: number | null = null; 
  searchName: string = ''; // Search by name
  searchPosition: string = ''; // Search by position
  isLoading = false;
  positions = Object.values(TeacherPosition);
  passingGrade: number = 3.0;

  constructor(private teacherService: TeacherService, private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchTeachers();
  }


  // Fetch all teachers
  fetchTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe(
      (data) => {
        this.teachers = data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error fetching teachers';
        this.isLoading = false;
      }
    );
  }

  fetchGraduateCount(teacherId: number): void {
    this.teacherService
      .getGraduateCountForTeacher(teacherId, this.passingGrade)
      .subscribe(
        (count) => {
          this.graduateCount = count;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching graduate count:', error);
          this.errorMessage = 'Error fetching graduate count';
        }
      );
  }

  // Search teachers by name or position
  searchTeachers(): void {
    if (this.searchName.trim()) {
      this.teacherService.getTeachersByName(this.searchName).subscribe(
        (data) => {
          this.teachers = data;
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        (error) => {
          this.errorMessage = 'No teachers found with this name.';
          this.teachers = [];
          console.error('Error fetching teachers by name:', error);
        }
      );
    } else if (this.searchPosition.trim()) {
      this.teacherService.getTeachersByPosition(this.searchPosition).subscribe(
        (data) => {
          this.teachers = data;
          this.errorMessage = null;
          this.cdr.detectChanges();
        },
        (error) => {
          this.errorMessage = 'No teachers found with this position.';
          this.teachers = [];
          console.error('Error fetching teachers by position:', error);
        }
      );
    } else {
      this.fetchTeachers();
    }
  }

  // Clear the search and fetch all teachers
  clearSearch(): void {
    this.searchName = '';
    this.searchPosition = '';
    this.fetchTeachers();
  }

  // Update the selected teacher
  updateTeacher(): void {
    if (this.selectedTeacher) {
      this.teacherService.updateTeacher(this.selectedTeacher.id, this.selectedTeacher).subscribe(
        (updatedTeacher) => {
          const index = this.teachers.findIndex(teacher => teacher.id === updatedTeacher.id);
          if (index !== -1) {
            this.teachers[index] = updatedTeacher;
          }
          this.selectedTeacher = null; // Deselect after saving
        },
        (error) => {
          console.error('Error updating teacher:', error);
          this.errorMessage = 'Error updating teacher';
        }
      );
      this.cdr.detectChanges();
    }
  }


  // Delete the selected teacher
  deleteTeacher(): void {
    if (this.selectedTeacher) {
      this.userService.deleteUser(this.selectedTeacher.keycloakUserId).subscribe(
        () => {
          this.teachers = this.teachers.filter(
            (teacher) => teacher.id !== this.selectedTeacher.id
          );
          this.selectedTeacher = null;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error deleting teacher:', error);
          this.errorMessage = 'Error deleting teacher';
        }
      );
    }
  }

  // Toggle teacher selection
  toggleSelection(teacher: any): void {
    this.selectedTeacher = teacher;
    this.graduateCount = null; // Reset the graduate count
    this.fetchGraduateCount(teacher.id); // Fetch the count for the selected teacher
  }
}
