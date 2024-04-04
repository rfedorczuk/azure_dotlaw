import { TestBed } from '@angular/core/testing';

import { CourseInteractionService } from './course-interaction.service';

describe('CourseInteractionServiceService', () => {
  let service: CourseInteractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseInteractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
