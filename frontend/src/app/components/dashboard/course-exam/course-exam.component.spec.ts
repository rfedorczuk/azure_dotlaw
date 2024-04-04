import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseExamComponent } from './course-exam.component';

describe('CourseExamComponent', () => {
  let component: CourseExamComponent;
  let fixture: ComponentFixture<CourseExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseExamComponent]
    });
    fixture = TestBed.createComponent(CourseExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
