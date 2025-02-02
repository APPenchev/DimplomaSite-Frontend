import { TeacherPosition } from './teacher-position.enum';
import { IdGenerator } from './idgenerator';

export interface DefenseResult extends IdGenerator {
  grade: number;
  diplomaDefense: DiplomaDefense;
}

export interface Teacher extends IdGenerator {
  name: string;
  position: TeacherPosition;
  keycloakUserId: string;
  supervisedAssignments: DiplomaAssignment[];
  reviews: Review[];
  defenses: DiplomaDefense[];
}

export interface DiplomaAssignment extends IdGenerator {
  topic: string;
  goal: string;
  tasks: string;
  technologies: string;
  approved: boolean;
  student: Student;
  supervisor: Teacher;
  diplomaThesis: DiplomaThesis;
}


export interface DiplomaThesis extends IdGenerator {
  title: string;
  text: string;
  uploadDate: string; // Use ISO date string
  confidential: boolean;
  diplomaAssignment: DiplomaAssignment;
  review: Review;
  diplomaDefenses: DiplomaDefense[];
}


export interface DiplomaDefense extends IdGenerator {
  date: string; // Use ISO date string
  supervisorKeycloakId: string;
  committeeMembersKeycloakIds: string[];
  resultId: string;
  result: any;
}

export interface Review extends IdGenerator {
  text: string;
  uploadDate: string; // Use ISO date string
  positive: boolean;
  diplomaThesis: DiplomaThesis;
  reviewer: Teacher;
}

export interface Student extends IdGenerator {
  name: string;
  facultyNumber: string;
  keycloakUserId?: string; // Optional
  diplomaAssignment: DiplomaAssignment;
}