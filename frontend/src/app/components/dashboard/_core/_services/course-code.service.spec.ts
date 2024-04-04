import { TestBed } from '@angular/core/testing';

import { CourseCodeService } from './course-code.service';

describe('CourseCodeService', () => {
  let service: CourseCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
