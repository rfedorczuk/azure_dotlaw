import { TestBed } from '@angular/core/testing';

import { YourCoursesService } from './your-courses.service';

describe('YourCoursesService', () => {
  let service: YourCoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YourCoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
