
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  //private apiUrl = 'https://demo.crem.support/api/companies';
  private apiUri = `${environment.apiUri}/companies`;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<any> {
    return this.http.get(`${this.apiUri}/get-companies`);
  }

    // Dodawanie metody do aktualizacji danych firmy
    updateCompany(companyId: number, companyData: any): Observable<any> {
      return this.http.put(`${this.apiUri}/update/${companyId}`, companyData);
    }
  
    addCompanyVoucher(companyId: number, voucherCode: string): Observable<any> {
      console.log(`Sending companyId: ${companyId}, voucherCode: ${voucherCode}`); // Dodaj tę linię
      return this.http.post(`${this.apiUri}/add-voucher/${companyId}`, { voucherCode });
    }
    

    // Dodawanie metody do usuwania firmy
    deleteCompany(companyId: number): Observable<any> {
      return this.http.delete(`${this.apiUri}/delete/${companyId}`);
    }
}
