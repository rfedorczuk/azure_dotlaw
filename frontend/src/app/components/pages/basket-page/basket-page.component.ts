import { Component, OnInit } from '@angular/core';
import { BasketService } from '../core/service/basket.service';
import { CoursesService } from '../core/service/courses.service';
import { AuthService } from '../core/service/auth.service';
import { Router } from '@angular/router';
import { StripeService } from 'ngx-stripe';
import { PaymentService } from '../core/service/payment.service';
import { ToastService } from '../../dashboard/_core/_services/toast.service';
import { EventTypes } from '../../dashboard/_core/_models/event-types';
import { ToastStateService } from '../../dashboard/_shared/toastService/toast-state.service';

@Component({
  selector: 'app-basket-page',
  templateUrl: './basket-page.component.html',
  styleUrls: ['./basket-page.component.scss']
})

export class BasketPageComponent implements OnInit {
  //Basket items  
  basketItems: any[] = [];

  //Discounts
  discountCode: string = '';
  discountApplied: boolean = false;
  discountMessage: string = '';

  //Total amount
  totalAmount: number = 0;
  originalTotalAmount: number = 0;

  constructor(
    private basketService: BasketService,
    private coursesService: CoursesService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private toastService: ToastService,
    private toastStateService: ToastStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.toastStateService.showPurchaseSuccess$.subscribe((show) => {
    //   console.log('basket, ',show)
    //   if (show) {
    //     this.toastService.showToast(EventTypes.Success, 'Sukces', 'Kurs został pomyślnie dodany do koszyka.');
    //     this.toastStateService.setShowPurchaseSuccess(false); // Resetuj stan
    //   }
    // });
    this.subscribeToToastEvents();
    this.loadBasket();
  }
  

  loadBasket(): void {
    
    this.basketItems = []; // Wyczyść poprzednie kursy, aby uniknąć duplikacji
    const items = this.basketService.getBasket();
    this.totalAmount = 0; // Resetuj całkowitą kwotę na początku
    items.forEach(item => {
        this.coursesService.getCourseDetails(item.courseId).subscribe(response => {
          const course = response.data[0]; // Pobierz pierwszy element z tablicy 'data'
          console.log('corus', response.courseId)
          const libraryId = response.courseId;
          console.log('libraryId ',libraryId)
          const imagePath = `assets/images/features/${libraryId}.png`;
          console.log('course ', course.name, ' desc ', course.description);
          const extendedItem = {
            ...item,
            title: course.name,
            description: course.description || 'Brak opisu',
            price: parseFloat(response.price),
            imageUrl: imagePath
          };
      
          this.basketItems.push(extendedItem);
          this.totalAmount += parseFloat(response.price); // Upewnij się, że sumujesz liczbę
          this.originalTotalAmount = this.totalAmount;
          console.log('totalAmount ', this.totalAmount);
        });
      });
  }

  private subscribeToToastEvents(): void {
    this.toastService.toastEvents.subscribe(event => {
      // Log to verify the subscription is receiving events
      console.log('Toast event received:', event);
      // Implement the logic to display the toast based on the event
    });
  }

  applyDiscount(): void {
    if (!this.discountCode.trim()) {
      alert('Proszę wpisać kod rabatowy.');
      return;
    }
  
    this.basketService.applyDiscountCode(this.discountCode, this.totalAmount).then(response => { // Dodaj totalAmount jako argument
      if (response.success) {
       // alert('response.newTotalAmount '+response.newTotalAmount)
        this.totalAmount = parseFloat(response.newTotalAmount); // Asekuracja, że wartość jest liczbą
       // this.originalTotalAmount = this.totalAmount / (1 - parseFloat(response.discount) / 100); // Przelicz oryginalną kwotę
        this.discountApplied = true;
        this.discountMessage = `Zastosowano: ${this.discountCode}`;
      } else {
        this.discountMessage = response.message || 'Nie ma takiego kodu.';
      }
    }).catch(error => {
      console.error('Error applying discount code:', error);
      this.discountMessage = 'Podany kod rabatowy nie istnieje.';
    });
  }
  

  removeDiscount(): void {
    this.discountApplied = false; // Resetowanie flagi zastosowania rabatu
    this.totalAmount = this.originalTotalAmount; // Przywrócenie oryginalnej kwoty
    this.discountCode = ''; // Wyczyszczenie wprowadzonego kodu
    this.discountMessage = ''; // Usunięcie komunikatu o zastosowanym rabacie
  }

  
  
  purchaseCourses(): void {
    if (!this.authService.isAuthenticated()) {
      console.error("User is not logged in.");
      this.router.navigate(['/profile-authentication']);
      return;
    }

    const userId = this.authService.getUserData()?.userId;
    const discountMultiplier = this.discountApplied ? (this.totalAmount / this.originalTotalAmount) : 1; // Oblicz mnożnik zniżki
    const items = this.basketItems.map(item => {
      console.log(`Mapping item: ${item.title}, Price: ${item.price}`);
      // Aplikuj mnożnik zniżki do każdej ceny kursu
      const discountedPrice = Math.round(Number(item.price) * 100 * discountMultiplier); // Zapewnia liczbę całkowitą i konwertuje na grosze z uwzględnieniem zniżki
      return {
        name: item.title,
        amount: discountedPrice, // Użyj ceny po zniżce
        currency: 'pln',
        quantity: 1,
        courseId: item.courseId
      };
    });
    
    console.log('Items to send:', items);
    
     //var Stripe: stripe.StripeStatic;
    this.paymentService.createSession(items).subscribe({
      next: (response) => {
        const stripe = Stripe('pk_test_51Oo539BHXkVoVGsNJJFvdYeDBKXh77AxYo5urBMEYHq7b3HgpwonhrKNJn19L5JzxZajYWnNpfutY3kipxbDndt700tMbxCdYX');
        console.log('response ',response.id)
        stripe.redirectToCheckout({ sessionId: response.id }).then((result) => {
          if (result.error) {
            alert(result.error.message);
          }
        });
      },
      error: (err) => console.error('Error creating payment session', err)
    });
  }

  setDefaultImage(event: any) {
    event.target.src = 'assets/images/features/feature3.jpg';
  }
  

  removeFromBasket(courseId: string): void {
    this.basketService.removeFromBasket(courseId);
    this.loadBasket(); // Ponownie załaduj koszyk, aby odświeżyć widok i przeliczyć totalAmount
  }
}
