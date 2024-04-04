import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

@Injectable({ providedIn: 'root' })
export class ExamService {
  private apiUri = `${environment.apiUri}/exam`;
  private certApiUri = `${environment.apiUri}/certificates`;
  private reminderApiUri = `${environment.apiUri}/notification`;

  constructor(private http: HttpClient) {}

  addQuestion(courseId: number, questionText: string) {
    return this.http.post(`${this.apiUri}/courses/${courseId}/questions`, { questionText });
  }

  addAnswer(questionId: number, answerText: string, isCorrect: boolean) {
    return this.http.post(`${this.apiUri}/questions/${questionId}/answers`, { answerText, isCorrect });
  }

  deleteQuestion(questionId: number): Observable<any> {
    return this.http.delete(`${this.apiUri}/questions/${questionId}`);
  }
  
  updateQuestion(questionId: number, questionText: string): Observable<any> {
    return this.http.put(`${this.apiUri}/questions/${questionId}`, { questionText });
  }

  updateAnswer(answerId: number, answerText: string, isCorrect: boolean): Observable<any> {
    return this.http.put(`${this.apiUri}/answers/${answerId}`, { answerText, isCorrect });
  }

  getExam(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUri}/courses/${courseId}/exam`);
  }

  generateCertificate(courseName: string, userName: string, date: string, courseId: number, userId: string): Observable<Blob> {
    return this.http.post(`${this.certApiUri}/generate-pdf`, { courseName, userName, date, courseId, userId }, { responseType: 'blob' });
  }

  getCertificates(userId: number): Observable<any> {
    return this.http.get(`${this.certApiUri}/user-certificate/${userId}`);
  }

  getCertificateBlob(userId: number, courseId: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.certApiUri}/download-certificate/${userId}/${courseId}`, { responseType: 'blob' as 'json' });
  }

  downloadAllCertificates(companyId: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.certApiUri}/all-certificates/${companyId}`, { responseType: 'blob' as 'json' });
  }

  sendReminder(userId: number, userEmail: string, courseId: number, type: string) {
    const url = `${this.reminderApiUri}/send-reminder`;
    return this.http.post(url, { userId, courseId, userEmail, type });
  }
  
}
