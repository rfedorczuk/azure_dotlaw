import { TestBed } from '@angular/core/testing';

import { CourseSelectionService } from './course-selection.service';

describe('CourseSelectionService', () => {
  let service: CourseSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
