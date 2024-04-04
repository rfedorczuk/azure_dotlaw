import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourCourseComponent } from './your-course.component';

describe('YourCourseComponent', () => {
  let component: YourCourseComponent;
  let fixture: ComponentFixture<YourCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YourCourseComponent]
    });
    fixture = TestBed.createComponent(YourCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
