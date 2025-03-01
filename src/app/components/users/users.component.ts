import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: false
})
export class UsersComponent implements OnInit {
  newUser = {
    username: '',
    password: '',
    name: '',
    role: '',
    position: '',
  };

  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  createUser(): void {
    if (this.newUser.role === 'teacher') {
      const teacherPayload = {
        teacher: {
          name: this.newUser.name,
          position: this.newUser.position.toUpperCase(), 
        },
        credentials: {
          username: this.newUser.username,
          password: this.newUser.password,
        },
      };

      this.userService.createTeacher(teacherPayload).subscribe(
        (response) => {
          this.clearForm();
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Error creating teacher';
        }
      );
    } else if (this.newUser.role === 'student') {
      const studentPayload = {
        student: {
          name: this.newUser.name,
        },
        credentials: {
          username: this.newUser.username,
          password: this.newUser.password,
        },
      };

      this.userService.createStudent(studentPayload).subscribe(
        (response) => {
          this.clearForm();
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Error creating student';
        }
      );
    } else {
      alert('Please select a valid role (teacher/student).');
    }
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error deleting user';
      }
    );
  }

  clearForm(): void {
    this.newUser = { username: '', password: '', name: '', role: '', position: '' };
    this.errorMessage = null;
  }
}