import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUri = `${environment.apiUri}/your-course`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message || 'Server error');
  }

  saveProgress(userId: number, courseId: number, lessonId: number, progress: number) {
    const body = { userId, courseId, lessonId, progress };
    console.log(JSON.stringify(body))
    return this.http.post(`${this.apiUri}/save-progress`, body)
      .pipe(catchError(this.handleError));
  }

  getProgress(userId: number, courseId: number, lessonId: number) {
    return this.http.get<{ progress: number }>(`${this.apiUri}/get-progress/${userId}/${courseId}/${lessonId}`)
      .pipe(catchError(this.handleError));
  }
}
