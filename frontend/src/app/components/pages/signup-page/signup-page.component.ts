import { Component } from '@angular/core';
import { AuthService } from '../core/service/auth.service';

interface RegistrationData {
  email: string;
  name: string;
  surname: string;
  password: string;
  acceptTerms: boolean;
  role: string;
  voucher?: string; // Opcjonalna właściwość
}

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  showRegistrationForm = true;
  isLoading = false;
  errorMessage = '';
  currentTab = 'tab1';
  user = {
    email: '',
    name: '',
    surname: '',
    password: '',
    confirmPassword: '', // Added confirmPassword
    voucher: '',
    acceptTerms: false,
    role: 'user' // Default role
  };

  constructor(private authService: AuthService) {}

  onRegister(): void {
    this.errorMessage = '';
  
    if (!this.user.acceptTerms) {
      this.errorMessage = 'Regulamin zakupów oraz Polityka prywatności muszą zostać zaakceptowane.';
      return;
    }
  
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Hasła różnią się od siebie.';
      return;
    }
  
    // Tworzenie obiektu registrationData z typem RegistrationData
    const registrationData: RegistrationData = {
      email: this.user.email,
      name: this.user.name,
      surname: this.user.surname,
      password: this.user.password,
      acceptTerms: this.user.acceptTerms,
      role: this.user.role
    };
  
    // Dodajemy voucher tylko jeśli jest potrzebny i aktualna zakładka to 'tab1'
    if (this.currentTab === 'tab1' && this.user.voucher) {
      registrationData.voucher = this.user.voucher;
    }
  
    this.authService.register(registrationData).subscribe(
      response => {
        this.isLoading = true; 
        setTimeout(() => {
          this.isLoading = false;
          console.log('Registration successful', response);
          this.showRegistrationForm = false;
        }, 700);
      },
      error => {
        console.error('Registration failed', error);
        this.errorMessage = 'Rejestracja nie powiodła się. Spróbuj ponownie.';
      }
    );
  }
  
  // onRegister(): void {
  //   // Reset any existing error messages
  //   this.errorMessage = '';
  
  //   // Check if terms are accepted
  //   if (!this.user.acceptTerms) {
  //     this.errorMessage = 'Regulamin zakupów oraz Polityka prywatności muszą zostać zaakceptowane.';
  //     return;
  //   }
  
  //   // Check if passwords match
  //   if (this.user.password !== this.user.confirmPassword) {
  //     this.errorMessage = 'Hasła różnią się od siebie.';
  //     return;
  //   }
  
  //   // Prepare the data to be sent to the backend
  //   const registrationData = {
  //     email: this.user.email,
  //     name: this.user.name,
  //     surname: this.user.surname,
  //     password: this.user.password,
  //     voucher: this.user.voucher,
  //     acceptTerms: this.user.acceptTerms,
  //     role: this.user.role // Make sure this aligns with what your backend expects
  //   };
  
  //   // Call the AuthService to send the registration request
  //   this.authService.register(registrationData).subscribe(
  //     response => {
  //       this.isLoading = true; 
  //       setTimeout(() => {
  //         this.isLoading = false;
  //       console.log('Registration successful', response);
  //       this.showRegistrationForm = false;
  //       // Handle successful registration
  //     }, 700); // Czas oczekiwania: 700ms
  //     },
  //     error => {
  //       console.error('Registration failed', error);
  //       this.errorMessage = 'Rejestracje nie powiodła się. Spróbuj ponownie.';
  //       // Handle registration errors
  //     }
  //   );
  // }
  

  switchTab(event: MouseEvent, tab: string): void {
    event.preventDefault();
    this.currentTab = tab;
  }
}
