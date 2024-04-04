// payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeSessionResponse } from '../interface/stripe.types';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUri = `${environment.apiUri}`;

  constructor(private http: HttpClient) {}

  createSession(items: any[]): Observable<StripeSessionResponse> {
    console.log('items ',items)
    return this.http.post<StripeSessionResponse>(`${this.apiUri}/payments/create-payment-session`, { items });
  }
}
