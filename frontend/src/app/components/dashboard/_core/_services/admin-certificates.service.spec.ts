import { TestBed } from '@angular/core/testing';

import { AdminCertificatesService } from './admin-certificates.service';

describe('AdminCertificatesService', () => {
  let service: AdminCertificatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCertificatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
