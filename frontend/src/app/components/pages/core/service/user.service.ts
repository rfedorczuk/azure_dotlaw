import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { AvatarService } from './avatar.service';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUri = `${environment.apiUri}/user`;

  private apiExamUri = `${environment.apiUri}/admin`;

  constructor(private http: HttpClient, private authService: AuthService, private avatarService: AvatarService) {}

  getProfile(): Observable<any> {
    const userData = this.authService.getUserData();
    if (!userData) {
      throw new Error('User is not authenticated');
    }
    return this.http.get<any>(`${this.apiUri}/get/${userData.userId}`);
  }

  updateProfile(data: any): Observable<any> {
   // alert('upProfil')
    const userData = this.authService.getUserData();
    if (!userData) {
      throw new Error('User is not authenticated');
    }
    return this.http.put<any>(`${this.apiUri}/update/${userData.userId}`, data).pipe(
      tap(response => {
        if (response.avatarUrl) {
          this.avatarService.updateAvatarUrl(response.avatarUrl);
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    if (!this.authService.isAuthenticated()) {
      throw new Error('User is not authenticated');
    }
    const data = {
      currentPassword,
      newPassword
    };
    // Uwaga: Zakładam, że API_URL jest poprawne i wskazuje na odpowiedni endpoint backendu
    return this.http.post<any>(`${this.apiUri}/change-password`, data, {
      withCredentials: true // Dodajemy tę opcję, aby upewnić się, że ciasteczka (w tym z tokenem JWT) są dołączane do żądania
    });
  }

  updateUserProfile(userId: number, profileData: any): Observable<any> {
    // Upewnij się, że API_URL jest poprawnie zdefiniowane i wskazuje na odpowiedni endpoint
    return this.http.put(`${this.apiUri}/update/${userId}`, profileData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiExamUri}/delete/${userId}`);
  }
  
  
  

}
