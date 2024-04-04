
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren } from '@angular/core';
import { YourCoursesService } from '../../_core/_services/your-courses.service';
import { UserService } from 'src/app/components/pages/core/service/user.service';
import { EmailInvitationService } from '../../_core/_services/email-invitation.service';
import { CompaniesService } from '../../_core/_services/companies.service';
import { AuthService } from 'src/app/components/pages/core/service/auth.service';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.scss']
})
export class AdminCompaniesComponent {
  @ViewChildren('dropdown')
	dropdownElementRefs!: QueryList<ElementRef>;

  
  users: any[] = [];
  usersCount: number = 0;
  userCoursesCount: number = 0;
  emailAddresses: string[] = [];
inputValue: string = '';
editingUser: any = null;
companies: any[] = [];

isAddVoucherPopupOpen = false;
selectedCompanyId: number | null = null;
newVoucherCode: string = '';
currentVoucherPlaceholder: string = 'Kod vouchera';

  // Popup
  isOpen = false;
  isEditPopupClose = true;
  isEditPopupOpen = false
  editingCompany: any = null;

  constructor(
    private companiesService: CompaniesService,
    private authService: AuthService,
    private emailInvitationService: EmailInvitationService,
    private cdr: ChangeDetectorRef) {}

 
public isOpenArray: boolean[] = []; // Initialize with the number of dropdowns you have

toggleDropdown(clickedIndex: number): void {
    // Zamienia stan tylko klikniętego dropdownu.
    this.isOpenArray[clickedIndex] = !this.isOpenArray[clickedIndex];

    // Opcjonalnie: Zamyka pozostałe dropdowny, jeśli jest taka potrzeba.
    this.isOpenArray.forEach((_, index) => {
        if (index !== clickedIndex) {
            this.isOpenArray[index] = false;
        }
    });

    // Wywołanie detekcji zmian, aby upewnić się, że Angular zauważy aktualizację stanu.
    this.cdr.detectChanges();
}


@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  let clickedInside = false;

  this.dropdownElementRefs.forEach(ref => {
    if (ref.nativeElement.contains(event.target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    this.isOpenArray = this.isOpenArray.map(() => false);
    this.cdr.detectChanges();
  }
}
    
    openEditCompanyPopup(company: any): void {
      this.editingCompany = { ...company }; 
      this.isEditPopupOpen = true; 
    }
  
    closeEditPopup(): void {
      this.isEditPopupOpen = false;
      this.editingCompany = null;
    }

    openAddVoucherPopup(company: any): void {
      this.selectedCompanyId = company.id;
      // Bezpośrednie przypisanie wartości kodu vouchera do newVoucherCode zamiast używania placeholdera
      this.newVoucherCode = company.vouchers ? company.vouchers : '';
      this.isAddVoucherPopupOpen = true;
    }
    
    
    
    
    closeAddVoucherPopup(): void {
      this.isAddVoucherPopupOpen = false;
      this.selectedCompanyId = null;
      this.newVoucherCode = '';
    }

  ngOnInit() {
    this.loadCompanies();
  }
  // Wewnątrz klasy AdminUsersComponent

  loadCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (companiesData) => {
        this.companies = companiesData;
        console.log('Loaded companies:', this.companies);
      },
      error: (error) => {
        console.error('Error fetching companies', error);
      }
    });
  }

  updateCompany(): void {
    // Przykładowe wywołanie metody serwisu do aktualizacji firmy
    if (this.editingCompany && this.editingCompany.id) {
      this.companiesService.updateCompany(this.editingCompany.id, this.editingCompany).subscribe({
        next: (response) => {
          console.log('Firma zaktualizowana', response);
          this.closeEditPopup(); // Zamknij modal edycji
          this.loadCompanies(); // Załaduj ponownie listę firm
        },
        error: (error) => {
          console.error('Błąd podczas aktualizacji firmy', error);
        }
      });
    }
  }

  addVoucherToCompany(): void {
    if (!this.selectedCompanyId) {
      alert('Company ID is not selected.');
      return;
    }
    if (!this.newVoucherCode) {
      alert('Voucher code is empty.');
      return;
    }
    if (this.selectedCompanyId && this.newVoucherCode) {
      console.log('Before sending:', this.newVoucherCode);

      console.log('this.selectedCompanyId ',this.selectedCompanyId,' this.newVoucherCode ',this.newVoucherCode)
      this.companiesService.addCompanyVoucher(this.selectedCompanyId, this.newVoucherCode).subscribe({
        next: (response) => {
          console.log('Voucher operation successful', response.message);
          this.closeAddVoucherPopup();
          this.loadCompanies(); // Reload the companies to refresh the data
        },
        error: (error) => {
          console.error('Error in voucher operation', error);
          // Możesz tutaj dodać obsługę specyficznych błędów, np. pokazać różne komunikaty dla różnych błędów
        }
      });
    } else {
      alert('Please fill in all the fields.'); // Możesz tutaj dodać bardziej zaawansowaną walidację lub użyć formularza reaktywnego dla lepszej walidacji
    }
  }
  

  deleteCompany(companyId: number): void {
    // Przykładowe wywołanie metody serwisu do usunięcia firmy
    if(confirm('Czy na pewno chcesz usunąć tę firmę?')) {
      this.companiesService.deleteCompany(companyId).subscribe({
        next: (response) => {
          console.log('Firma usunięta', response);
          this.loadCompanies(); // Ponownie załaduj listę firm
        },
        error: (error) => {
          console.error('Błąd podczas usuwania firmy', error);
        }
      });
    }
  }



  openPopup(): void {
    this.isOpen = true;
  }

  closePopup(): void {
    this.isOpen = false;
    this.emailAddresses = []; // Czyszczenie listy adresów e-mail
    this.inputValue = ''; // Opcjonalnie, czyści również pole wprowadzania, jeśli jest otwarte
  }
  handleInput(event: any): void {
    const value = event.target.value.trim(); // Przycinanie białych znaków na końcach
    if (value && value.includes(',')) {
      const emails = value.split(',')
                          .map((email: string) => email.trim())
                          .filter((email: any) => email); // Usuwamy puste ciągi
      this.emailAddresses = [...this.emailAddresses, ...emails];
      this.inputValue = ''; // Czyści pole wprowadzania
    } else {
      this.inputValue = value;
    }
  }
  
  removeEmail(index: number): void {
    this.emailAddresses.splice(index, 1); // Usuń adres e-mail
  }

  sendInvitations(): void {
    const companyId = this.authService.getUserData().companyId; // Pobierz companyId z serwisu autoryzacji
    if (this.emailAddresses.length > 0 && companyId) {
      this.emailInvitationService
        .sendInvitations(this.emailAddresses, companyId)
        .subscribe({
          // Logika obsługi odpowiedzi i błędów...
        });
    } else {
      alert("Proszę dodać przynajmniej jeden adres e-mail.");
    }
  }
  
}

