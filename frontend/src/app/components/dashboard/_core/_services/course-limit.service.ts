// src/app/_services/course-limit.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseLimitService {
  private apiUri = `${environment.apiUri}/course`;

  constructor(private http: HttpClient) { }

  setUserLimit(courseId: number, userLimit: number): Observable<any> {
    const url = `${this.apiUri}/${courseId}/set-user-limit`;
    return this.http.put(url, { userLimit });
  }
}
