// services/your-courses.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class YourCoursesService {
  private apiUri = `${environment.apiUri}/course`;
  private apiReportsUri = `${environment.apiUri}/get/reports`;
  private apiExamUri = `${environment.apiUri}/admin`;
  private coursesListCache: any;
  private coursesCache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  getUserCourses(userId: number): Observable<any> {
    return this.http.get(`${this.apiUri}/user/${userId}/courses`);
  }

  getUsersByCompany(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUri}/company/${companyId}`);
  }

  getCoursesByCompany(companyId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUri}/company/get/${companyId}`);
  }

  getAllCourses(): Observable<any> {
    return this.http.get<any[]>(`${this.apiExamUri}/courses-count`);
  }

  getAllAdminCourses(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUri}/get-all-courses`);
  }


  getActiveCoursesInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiExamUri}/courses-info`);
  }

  getCompletedCourses(companyId: string): Observable<any> {
    return this.http.get(`${this.apiUri}/company/completed-courses/${companyId}`);
  }

  getCompletedUserCourses(userId: string): Observable<any> {
    return this.http.get(`${this.apiUri}/user/completed-courses/${userId}`);
  }

  getCompletedCoursesCountForUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUri}/user/completed-courses/${userId}`);
  }

  assignUsersToCourse(courseId: number, userIds: string[], companyId: number): Observable<any> {
    return this.http.post(`${this.apiUri}/assign-users-to-course`, { courseId, userIds, companyId });
  }
  

generateCourseCode(courseId: number, validUntil?: string): Observable<any> {
  const url = `${this.apiUri}/generate-course-code`;
  return this.http.post(url, { courseId, validUntil });
}

assignCompaniesToCourse(courseId: number, companyIds: number[]): Observable<any> {
  const url = `${this.apiUri}/assign-companies`;
  return this.http.post(url, { courseId, companyIds }, { responseType: 'text' });
}


getAllCompanies(courseId?: number): Observable<any[]> {
  let params = new HttpParams();
  if (courseId !== undefined) {
    params = params.set('courseId', courseId.toString());
  }
  return this.http.get<any[]>(`${this.apiUri}/get/companies`, { params });
}


exportCourseReport(courseId: number): Observable<Blob> {
  return this.http.get(`${this.apiReportsUri}/courses/${courseId}`, { responseType: 'blob' });
}

  

  
 // /api/exam

  // getCourseDetails(courseId: number) {
  //   return this.http.get(`${this.apiUrl}/courses/details/${courseId}`);
  // }


getCourseDetails(courseId: string) {
  console.log('getCourseDetails ',courseId)
  // Check if the course is already in the cache
  if (this.coursesCache.has(courseId)) {
    return of(this.coursesCache.get(courseId));
  }

  // If the course is not in the cache, fetch it from the API 19347949
  return this.http.get<any>(`${this.apiUri}/vimeo/courses/${courseId}`).pipe(
    tap((course: any) => {
      this.coursesCache.set(courseId, course);
    })
  );
}
}


