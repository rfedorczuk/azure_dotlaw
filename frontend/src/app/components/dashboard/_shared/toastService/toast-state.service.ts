import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastStateService {
  private _showPurchaseSuccess = new BehaviorSubject<boolean>(false);
  
  showPurchaseSuccess$ = this._showPurchaseSuccess.asObservable();

  setShowPurchaseSuccess(show: boolean): void {
    console.log('toastState ',show)
    this._showPurchaseSuccess.next(show);
  }
}
