import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { ToastService } from '../../dashboard/_core/_services/toast.service';
import { EventTypes } from '../../dashboard/_core/_models/event-types';

@Component({
  selector: 'app-profile-authentication-page',
  templateUrl: './profile-authentication-page.component.html',
  styleUrls: ['./profile-authentication-page.component.scss']
})
export class ProfileAuthenticationPageComponent implements OnInit{
  loginData = {
    email: '',
    password: ''
  };
  loginError: string = '';
  message: string = '';
  alertType: string = '';
  isLoading = false;


  constructor(
    private authService: AuthService, 
    private toastService: ToastService,
    private router: Router, 
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const messageCode = params['message'];
        switch (messageCode) {
          case 'invalidToken':
            this.message = 'Twoje konto nie zostało aktywowane, link wygasł. Zarejestruj się raz jeszcze.';
            this.alertType = 'warning';
            break;
          case 'activationSuccessful':
            this.message = 'Twoje konto zostało poprawnie aktywowane. Zaloguj się.';
            this.alertType = 'success';
            break;
          case 'activationError':
            this.message = 'Wystąpił błąd podczas aktywacji konta.';
            this.alertType = 'danger';
            break;
        }
      });
    }
    

  onLogin(): void {
    this.authService.login(this.loginData).subscribe(
      response => {
        this.isLoading = true; 
      setTimeout(() => {
        this.isLoading = false;
        this.authService.setUserData(response.userData);
        this.cdr.detectChanges();
        this.toastService.showToast(EventTypes.Success, 'Sukces', 'Zalogowałes się pomyślnie');
       // alert(response.userData.role)
  
        // Sprawdź, czy użytkownik miał zamiar zakupić kurs
        const intendedCourseId = this.authService.retrieveCourseIntent();
        if (intendedCourseId) {
          
          this.router.navigate(['/course-details', intendedCourseId]); // Przekieruj do strony kursu
        } else {
          // Sprawdź rolę użytkownika i przekieruj na odpowiednią stronę
          if (response.userData.role === 'admin' || response.userData.role === 'superadmin') {
            this.router.navigate(['/admin-dashboard']); // Przekieruj administratora
          } else {
            this.router.navigate(['/dashboard']); // Przekieruj pozostałych użytkowników
          }
        }
      }, 700); // Czas oczekiwania: 700ms
      },
      error => {
        console.error('Login failed', error);
      this.loginError = 'Błędny email lub hasło.'; // Ustaw komunikat o błędzie
      }
    );
  }
  
}
