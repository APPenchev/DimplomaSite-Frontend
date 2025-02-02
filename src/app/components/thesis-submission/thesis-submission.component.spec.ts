import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThesisSubmissionComponent } from './thesis-submission.component';

describe('ThesisSubmissionComponent', () => {
  let component: ThesisSubmissionComponent;
  let fixture: ComponentFixture<ThesisSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThesisSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThesisSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
