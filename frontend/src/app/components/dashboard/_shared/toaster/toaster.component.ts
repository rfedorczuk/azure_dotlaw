import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastEvent } from '../../_core/_models/toast-event';
import { ToastService } from '../../_core/_services/toast.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent implements OnInit {
  currentToasts: ToastEvent[] = [];

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscribeToToasts();
  }

  subscribeToToasts() {
    console.log('Subscribing to toasts');
    this.toastService.toastEvents.subscribe((toast) => {
      console.log('Received toast:', toast); // Log the received toast
      this.currentToasts.push({
        type: toast.type,
        title: toast.title,
        message: toast.message,
      });
      this.cdr.detectChanges(); // Update the view
    });
}

  // subscribeToToasts() {
  //   console.log('toast')
  //   this.toastService.toastEvents.subscribe((toasts) => {
  //     const currentToast: ToastEvent = {
  //       type: toasts.type,
  //       title: toasts.title,
  //       message: toasts.message,
  //     };
  //     this.currentToasts.push(currentToast);
  //     this.cdr.detectChanges();
  //   });
  // }

  dispose(index: number) {
    this.currentToasts.splice(index, 1);
    this.cdr.detectChanges();
  }
}