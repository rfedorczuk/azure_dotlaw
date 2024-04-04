import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUri = `${environment.apiUri}/lesson`;

  constructor(private http: HttpClient) {}

  saveNote(note: { user_id: number; course_id: number; content: string }): Observable<any> {
    return this.http.post(`${this.apiUri}/notes`, note);
  }

  getNotes(userId: number, courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUri}/notes/${userId}/${courseId}`);
  }
}
