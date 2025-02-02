import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './components/student/student.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { RoleGuard } from './guards/role.guard';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { AssignmentCreateComponent } from './components/assignment-create/assignment-create.component';
import { AssignmentDetailsComponent } from './components/assignment-details/assignment-details.component';
import { ReviewSubmissionComponent } from './components/review-submission/review-submission.component';
import { ThesisSubmissionComponent } from './components/thesis-submission/thesis-submission.component';
import { ThesisDetailsComponent } from './components/thesis-details/thesis-details.component';
import { ReviewDetailsComponent } from './components/review-details/review-details.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { DefenseSubmissionComponent } from './components/defense-submission/defense-submission.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { 
    path: 'assignments/create', 
    component: AssignmentCreateComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher'] } 
  },
  { 
    path: 'assignments/:id', 
    component: AssignmentDetailsComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher', 'student'] } 
  },
  { path: 'theses/submit', 
    component: ThesisSubmissionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['admin','teacher','student']}
   },
   { path: 'defense/submit', 
    component: DefenseSubmissionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['admin','teacher']}
   },
   { path: 'theses/:id', 
    component: ThesisDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['admin','teacher','student']}
   },
  { 
    path: 'students',
    component: StudentComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin','teacher'] } 
  },
  { 
    path: 'reviews/submit', 
    component: ReviewSubmissionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin','teacher']}
   },
   { 
    path: 'reviews/:id', 
    component: ReviewDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'teacher', 'student'] },
  },
  { 
    path: 'teachers',
    component: TeacherComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] } 
  },
  { 
    path: 'assignments',
    component: AssignmentComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin','teacher'] } 
  },
  { 
    path: 'login',
    component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard]},
  { 
    path: 'users', 
    component: UsersComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] } },
  { 
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] } 
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}