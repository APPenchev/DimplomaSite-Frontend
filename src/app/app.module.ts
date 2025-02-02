import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { StudentComponent } from './components/student/student.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { StudentService } from './services/student.service';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { AssignmentCreateComponent } from './components/assignment-create/assignment-create.component';
import { AssignmentDetailsComponent } from './components/assignment-details/assignment-details.component';
import { ReviewService } from './services/review.service';
import { TeacherService } from './services/teacher.service';
import { ReviewSubmissionComponent } from './components/review-submission/review-submission.component';
import { ThesisSubmissionComponent } from './components/thesis-submission/thesis-submission.component';
import { ThesisDetailsComponent } from './components/thesis-details/thesis-details.component';
import { ReviewDetailsComponent } from './components/review-details/review-details.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { DefenseSubmissionComponent } from './components/defense-submission/defense-submission.component';
import { AssignmentService } from './services/assignment.service';
import { DefenseService } from './services/defense.service';
import { AdminComponent } from './components/admin/admin.component';




@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    AccessDeniedComponent,
    TeacherComponent,
    AssignmentCreateComponent,
    AssignmentDetailsComponent,
    ReviewSubmissionComponent,
    ThesisSubmissionComponent,
    ThesisDetailsComponent,
    ReviewDetailsComponent,
    AssignmentComponent,
    DefenseSubmissionComponent,
    AdminComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    
  ],
  providers: [
    AuthService,
    UserService,
    StudentService,
    ReviewService,
    TeacherService,
    AssignmentService,
    DefenseService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}