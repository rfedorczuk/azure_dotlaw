import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EventTypes } from '../_models/event-types';
import { ToastEvent } from '../_models/toast-event';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastEvents: Observable<ToastEvent>;
  private _toastEvents = new Subject<ToastEvent>();

  constructor() {
    this.toastEvents = this._toastEvents.asObservable();
  }

  /**
   * Show a toast notification based on the type with a title and a message.
   * @param type The type of the toast (success, info, warning, error)
   * @param title The title of the toast
   * @param message The message of the toast
   */
  showToast(type: EventTypes, title: string, message: string) {
    console.log('showToast ',)
    this._toastEvents.next({ type, title, message });
  }

  // The specific methods could be kept for backward compatibility or for convenience
  // However, they are no longer necessary if showToast is used for all toast notifications

  /**
   * Show success toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showSuccessToast(title: string, message: string) {
    this.showToast(EventTypes.Success, title, message);
  }

  /**
   * Show info toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showInfoToast(title: string, message: string) {
    this.showToast(EventTypes.Info, title, message);
  }

  /**
   * Show warning toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showWarningToast(title: string, message: string) {
    this.showToast(EventTypes.Warning, title, message);
  }

  /**
   * Show error toast notification.
   * @param title Toast title
   * @param message Toast message
   */
  showErrorToast(title: string, message: string) {
    this.showToast(EventTypes.Error, title, message);
  }
}
