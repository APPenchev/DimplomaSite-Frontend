import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { DefenseService } from '../../services/defense.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-defense-submission',
  templateUrl: './defense-submission.component.html',
  styleUrls: ['./defense-submission.component.css'],
  standalone: false,
})
export class DefenseSubmissionComponent implements OnInit {
  teachers: any[] = [];
  selectedTeachers: any[] = [];
  selectedSupervisor: any | null = null;
  defenseDate: string = '';
  thesisId: number | null = null;

  constructor(
    private teacherService: TeacherService,
    private defenseService: DefenseService,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.fetchTeachers();
  
      const id = this.route.snapshot.queryParams['thesisId'];
      this.thesisId = id ? +id : null;
      if (this.authService.hasRole('teacher')) {
        const currentUser = this.authService.getUserId();
        const teacher = this.teachers.find((t) => t.keycloakUserId === currentUser);
        if (teacher) {
          this.selectedSupervisor = teacher;
        } else {
          console.warn('No matching teacher found for the current user. Check keycloakId.');
        }
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }
  fetchTeachers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.teacherService.getAllTeachers().subscribe(
        (data) => {
          const currentUserId = this.authService.getUserId();
          this.teachers = data.filter(
            (teacher) => teacher.keycloakId !== currentUserId
          );
          resolve();
        },
        (error) => {
          console.error('Error fetching teachers:', error);
          reject(error);
        }
      );
    });
  }

  toggleTeacherSelection(teacher: any): void {
    if (this.selectedTeachers.includes(teacher)) {
      this.selectedTeachers = this.selectedTeachers.filter((t) => t !== teacher);
    } else {
      this.selectedTeachers.push(teacher);
    }
  }

  selectSupervisor(supervisor: any): void {
    this.selectedSupervisor = supervisor;

    this.selectedTeachers = this.selectedTeachers.filter(
      (teacher) => teacher.id !== supervisor.id
    );

    this.fetchTeachers();
  }

  submitDefense(): void {
    console.log(this.selectedSupervisor)
    if (!this.defenseDate || !this.selectedSupervisor || this.selectedTeachers.length === 0 || !this.thesisId) {
      alert('Please fill in all fields!');
      return;
    }

    const defenseData = {
      supervisorId: this.selectedSupervisor.id,
      date: this.defenseDate,
      thesisId: this.thesisId,
      committeeMembersIds: this.selectedTeachers.map((teacher) => teacher.id),
    };

    this.defenseService.createDefense(defenseData).subscribe(
      (response) => {
        alert('Defense submitted successfully!');
        this.router.navigate(['/theses', this.thesisId]);
      },
      (error) => {
        console.error('Error submitting defense:', error);
        alert('Failed to submit defense. Please try again.');
      }
    );
  }
}