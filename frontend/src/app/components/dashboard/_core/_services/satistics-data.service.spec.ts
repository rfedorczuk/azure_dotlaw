import { TestBed } from '@angular/core/testing';

import { SatisticsDataService } from './satistics-data.service';

describe('SatisticsDataService', () => {
  let service: SatisticsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SatisticsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
