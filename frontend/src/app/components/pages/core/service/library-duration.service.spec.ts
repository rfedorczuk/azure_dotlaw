import { TestBed } from '@angular/core/testing';

import { LibraryDurationService } from './library-duration.service';

describe('LibraryDurationService', () => {
  let service: LibraryDurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryDurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
