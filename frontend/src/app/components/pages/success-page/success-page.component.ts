import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../core/service/courses.service';
import { AuthService } from '../core/service/auth.service';
import { BasketService } from '../core/service/basket.service';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private basketService: BasketService,
    private coursesService: CoursesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (sessionId) {
      console.log('sessionId ',sessionId)
      this.finalizePurchase(sessionId);
    } else {
      console.log('No session ID found');
      // Możliwe przekierowanie do strony głównej lub koszyka
    }
  }

  finalizePurchase(sessionId: string): void {
    console.log('finalizePurchase ')
    const userId = this.authService.getUserData()?.userId;
    if (!userId) {
      console.error('User is not logged in');
      this.router.navigate(['/profile-authentication']);
      return;
    }
    this.coursesService.verifyPaymentAndEnroll(userId, sessionId).subscribe({
      next: (response) => {
        console.log('response ',JSON.stringify(response))
        if (response.success) {
          console.log('Successfully enrolled in the course(s)');
          // Czyszczenie koszyka po pomyślnym zapisie
          this.basketService.clearBasket();
          // Przekierowanie do dashboardu lub innej strony po pomyślnym zapisie
          setTimeout(() => {
            this.router.navigate(['/dashboard/szkolenia']);
          }, 3000);
          
        } else {
          console.error('Payment verification failed');
          // Tutaj można obsłużyć błąd, np. wyświetlając stosowny komunikat
        }
      },
      error: (error) => {
        console.error('Error during the enrollment process', error);
        // Obsługa błędów komunikacji z backendem
      }
    });
  }
  
}
