// email-invitation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailInvitationService {
  private apiUri = `${environment.apiUri}/invitation`;
  constructor(private http: HttpClient) {}

  sendInvitations(emails: string[], companyId: number) {
    return this.http.post(`${this.apiUri}/send-invitations`, { emails, companyId });
  }

  sendInvitationsAdmin(emails: string[]) {
    return this.http.post(`${this.apiUri}/send-invitations-admin`, { emails });
  }
  
  
}
