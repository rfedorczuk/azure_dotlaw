import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketSubject = new BehaviorSubject<any[]>(this.getBasket());
  private apiUri = `${environment.apiUri}/discount`;

  constructor(private http: HttpClient) {}

  // Dodaj kurs do koszyka
  addToBasket(courseId: string, amount: number): void {
    let basket = this.getBasket();
    const index = basket.findIndex((item: any) => item.courseId === courseId);
  
    if (index !== -1) {
      // Jeśli kurs już istnieje w koszyku, zaktualizuj jego ilość
      basket[index].amount = amount;
    } else {
      // Jeśli kurs nie istnieje w koszyku, dodaj go
      basket.push({ courseId, amount });
    }
  
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSubject.next(basket); // Kluczowa zmiana: aktualizuj obserwatorów z nowym koszykiem
  }
  

  // Pobierz zawartość koszyka
  getBasket(): any[] {
    const basket = localStorage.getItem('basket');
    return basket ? JSON.parse(basket) : [];
  }

  getBasketObservable(): Observable<any[]> {
    return this.basketSubject.asObservable();
  }

  applyDiscountCode(code: string, totalAmount: number): Promise<any> {
    // Użyj parametrów zapytania lub ciała żądania do przekazania całkowitej kwoty
    return this.http.get(`${this.apiUri}/discount-code/${code}?totalAmount=${totalAmount}`).toPromise();
  }
  // Usuń kurs z koszyka
// Usuń kurs z koszyka
removeFromBasket(courseId: string): void {
  const basket = this.getBasket();
  const updatedBasket = basket.filter((item: any) => item.courseId !== courseId);
  
  localStorage.setItem('basket', JSON.stringify(updatedBasket));
  this.basketSubject.next(updatedBasket); // Ważne: poinformuj obserwatorów o zmianie
}


  // Czyść koszyk
  // Czyść koszyk
clearBasket(): void {
  localStorage.removeItem('basket');
  this.basketSubject.next([]); // Informuj obserwatorów o wyczyszczeniu koszyka
}

}
