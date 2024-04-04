import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserService } from './user.service';
import { AvatarService } from './avatar.service';
import { environment } from '../../../../../environments/environment'; 

interface LoginResponse {
  message: string;
  userData: {
    userId: number;
    email: string;
    role: string;
    company: number;
    avatar?: string;
  };
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthState());
  private apiUri = `${environment.apiUri}`;
  private userData: any = null;
  private userRole = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private avatarService: AvatarService) {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      this.userData = userData;
      if (userData.avatar) {
        this.avatarService.updateAvatarUrl(userData.avatar);
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUri}/auth/register`, userData);
  }

  activateAccount(token: string): Observable<any> {
    return this.http.get(`${this.apiUri}/auth/activate/${token}`);
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUri}/auth/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response.userData) {
          console.log('response.userData ',response.userData)
          // Teraz pole avatar jest uwzględnione w interfejsie LoginResponse
          this.setUserData(response.userData);
          this.updateAuthenticationStatus();
        //  this.isAuthenticated();
        }
      })
    );
  }
  
  retrieveCourseIntent() {
    const courseId = localStorage.getItem('courseIntent');
    localStorage.removeItem('courseIntent');
    return courseId ? parseInt(courseId) : null;
  }

  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUri}/auth/verify-token`);
  }

  // changePassword(userId: number, passwordData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/user/change-password/${userId}`, passwordData);
  // }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUri}/user/get/${userId}`);
  }

  updateUserProfile(userId: number, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUri}/user/update/${userId}`, profileData).pipe(
      tap((updatedUserData) => {
        // Zaktualizuj dane użytkownika w AuthService
        this.setUserData({...this.getUserData(), ...updatedUserData});
      })
    );
  }

  setUserData(data: any): void {
    this.userData = data;
    this.userRole.next(data.role); // Update the role
    localStorage.setItem('userData', JSON.stringify(data));
    if (data.avatar) {
      this.avatarService.updateAvatarUrl(data.avatar);
    }
    
  }
  

  getUserRole(): Observable<string> {
    return this.userRole.asObservable();
  }

  
  isAuthenticated(): boolean {
    return !!this.userData;
  }
  
  private updateAuthenticationStatus(): void {
    const isAuthenticated = !!this.userData;
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  private clearAuthenticationStatus(): void {
    this.isAuthenticatedSubject.next(false);
  }

  private checkInitialAuthState(): boolean {
    // Inicjalizuj stan uwierzytelnienia na podstawie istniejących danych (np. sprawdzając localStorage)
    return !!this.userData;
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  hasRole(requiredRole: string): boolean {
    console.log('hasrole requiredRole: ',requiredRole)
    return this.isAuthenticated() && this.userData.role === requiredRole;
  }

  getUserData(): any {
    return this.userData;
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.userData = null;
    this.userRole.next('');
    this.avatarService.resetAvatarUrl();
    this.clearAuthenticationStatus();
  }
  

}
