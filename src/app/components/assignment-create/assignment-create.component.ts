import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-assignment-create',
  templateUrl: './assignment-create.component.html',
  styleUrls: ['./assignment-create.component.css'],
  standalone: false,
})
export class AssignmentCreateComponent implements OnInit {
  studentId: number = 0;
  assignment = {
    topic: '',
    goal: '',
    tasks: '',
    technologies: '',
    supervisorId: 0, 
  };

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private assignmentService: AssignmentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.studentId = +params['studentId'];
    });

   
  }

  createAssignment(): void {
    const payload = { ...this.assignment, studentId: this.studentId };
    
    this.assignmentService.createAssignment(payload).subscribe(
      (response) => {
        alert('Assignment created successfully!');
        this.router.navigate(['/students']);
      },
      (error) => {
        console.error(error);
        alert('Failed to create assignment.');
      }
    );
  }
}