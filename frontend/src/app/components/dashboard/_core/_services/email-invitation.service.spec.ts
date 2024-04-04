import { TestBed } from '@angular/core/testing';

import { EmailInvitationService } from './email-invitation.service';

describe('EmailInvitationService', () => {
  let service: EmailInvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailInvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
