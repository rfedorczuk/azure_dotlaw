import { TestBed } from '@angular/core/testing';

import { CourseLimitService } from './course-limit.service';

describe('CourseLimitService', () => {
  let service: CourseLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
