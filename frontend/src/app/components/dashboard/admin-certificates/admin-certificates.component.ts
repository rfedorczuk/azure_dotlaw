
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { CompaniesService } from '../_core/_services/companies.service';
import { AdminCertificatesService } from '../_core/_services/admin-certificates.service';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrls: ['./admin-certificates.component.scss']
})
export class AdminCertificatesComponent {
  certificates: any[] = [];
  usersCount: number = 0;
  userCoursesCount: number = 0;
  isOpenArray: boolean[] = [];
  emailAddresses: string[] = [];
inputValue: string = '';
editingUser: any = null;
companies: any[] = [];

  // Popup
  isOpen = false;
  isEditPopupClose = true;
  isEditPopupOpen = false

  constructor(
    private certificatesService: AdminCertificatesService) {}

    toggleDropdown(clickedIndex: number): void {
      this.isOpenArray = this.isOpenArray.map((_, index) => index === clickedIndex ? !this.isOpenArray[index] : false);
    }
  
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const dropdowns = document.querySelectorAll('.dropdown');
      
      dropdowns.forEach((dropdown, index) => {
        const button = dropdown.querySelector('.btn');
        if (!dropdown.contains(event.target as Node)) {
          this.isOpenArray[index] = false;
        }
      });
    }
    
  openEditUserPopup(user: any): void {
    this.editingUser = { ...user }; 
    this.isEditPopupOpen = true; 
  }
  closeEditPopup(): void {
    this.isEditPopupClose = false; // Zamknięcie modalu
    this.isEditPopupOpen = false; 
    this.editingUser = null; // Opcjonalne, wyczyszczenie edytowanego użytkownika
  }

  ngOnInit() {
    this.loadCertificatesInfo();
  }
  // Wewnątrz klasy AdminUsersComponent

  loadCertificatesInfo(): void {
    this.certificatesService.getCertificatesInfo().subscribe({
      next: (data) => {
        this.certificates = data;
      },
      error: (err) => {
        console.error('Error fetching courses info:', err);
      }
    });
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

  
}


