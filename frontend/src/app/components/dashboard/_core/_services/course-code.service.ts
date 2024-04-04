// src/app/_core/_services/course-code.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseCodeService {

  private apiUri = `${environment.apiUri}/course`;

  constructor(private http: HttpClient) { }

  addCourseWithCode(courseCode: string, userId: number): Observable<any> {
    console.log('courseCode ',courseCode, ' ',userId)
    const payload = { courseCode, userId };
    return this.http.post(`${this.apiUri}/addCourse`, payload);
  }
}
