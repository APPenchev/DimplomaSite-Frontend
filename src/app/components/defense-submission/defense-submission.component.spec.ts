import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseSubmissionComponent } from './defense-submission.component';

describe('DefenseSubmissionComponent', () => {
  let component: DefenseSubmissionComponent;
  let fixture: ComponentFixture<DefenseSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefenseSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefenseSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
