import { Component, OnInit } from '@angular/core';
import { ContactEmailService } from '../core/service/contact-email.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
    // Accordion
    contentHeight: number = 0;
    openSectionIndex: number = 0;

    // Email form
    email = '';
    message = '';

    isLoading = false;
    messageForm = '';
    alertType = '';
    

    constructor(private emailService: ContactEmailService) {}
 
    ngOnInit(): void {
        this.calculateContentHeight();
    }
 
    toggleSection(index: number): void {
        if (this.openSectionIndex === index) {
            this.openSectionIndex = -1;
        } else {
            this.openSectionIndex = index;
            this.calculateContentHeight();
        }
    }
 
    isSectionOpen(index: number): boolean {
        return this.openSectionIndex === index;
    }
 
    calculateContentHeight(): void {
        const contentElement = document.querySelector('.accordion-content');
        if (contentElement) {
            this.contentHeight = contentElement.scrollHeight;
        }
    }

    sendEmail(): void {
        this.isLoading = true; // Pokaż spinner
        const emailData = { email: this.email, message: this.message };
    
        this.emailService.sendEmail(emailData).subscribe({
          next: (response) => {
            // Opóźnienie ukrycia spinnera i resetowanie formularza
            setTimeout(() => {
              this.isLoading = false; // Ukryj spinner
              this.messageForm = 'Email został wysłany pomyślnie.';
              this.alertType = 'success';
              this.email = '';
              this.message = '';
            }, 1000); // Opóźnienie o 1 sekundę
          },
          error: (error) => {
            // Opóźnienie wyświetlenia komunikatu o błędzie
            setTimeout(() => {
              this.isLoading = false; // Ukryj spinner
              this.messageForm = 'Wystąpił błąd podczas wysyłania wiadomości.';
              this.alertType = 'danger';
            }, 1000); // Opóźnienie o 1 sekundę
          }
        });
    }
    
    
 }
