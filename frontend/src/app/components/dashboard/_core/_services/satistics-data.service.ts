import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class StatisticsDataService {
  private apiUri = `${environment.apiUri}/statistics`;

  constructor(private http: HttpClient) { }

  getSalesStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUri}/sales-statistics`);
  }
}
