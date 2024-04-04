
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { YourCoursesService } from '../_core/_services/your-courses.service';
import { EmailInvitationService } from '../_core/_services/email-invitation.service';
import { UserService } from '../../pages/core/service/user.service';
import { AuthService } from '../../pages/core/service/auth.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  usersCount: number = 0;
  userCoursesCount: number = 0;
  isOpenArray: boolean[] = [];
  emailAddresses: string[] = [];
inputValue: string = '';
editingUser: any = null;

  // Popup
  isOpen = false;
  isEditPopupClose = true;
  isEditPopupOpen = false

  constructor(
    private yourCoursesService: YourCoursesService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private emailInvitationService: EmailInvitationService) {}

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
    this.loadUsers();
  }
  // Wewnątrz klasy AdminUsersComponent

  updateUser(): void {
    // Zakładając, że `UserService` zawiera metodę `updateUserProfile` zaimplementowaną poprawnie
    this.userService.updateUserProfile(this.editingUser.id, this.editingUser).subscribe({
      next: (response) => {
        console.log('Użytkownik zaktualizowany', response);
        this.isEditPopupOpen = false; // Zamknij modal edycji
        this.editingUser = null; // Wyczyść edytowanego użytkownika
        this.loadUsers(); // Załaduj ponownie listę użytkowników, opcjonalnie
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Błąd podczas aktualizacji użytkownika', error);
        // Tutaj możesz obsłużyć błędy, np. wyświetlić komunikat
      }
    });
  }

  loadUsers(): void {
    this.yourCoursesService.getActiveCoursesInfo().subscribe(
      (usersData) => {
        this.users = usersData;
        console.log('this.users ',this.users)
       // this.userCoursesCount = usersData.length;
        this.usersCount = usersData.length;
        // Konwersja danych avatara z formatu binarnego na Base64...
        this.users.forEach((user, index) => {
          if (user.avatar && user.avatar.data) {
            const blob = new Blob([new Uint8Array(user.avatar.data)], { type: 'image/jpeg' });
            const reader = new FileReader();
  
            reader.onloadend = () => {
              user.avatarBase64 = reader.result as string;
              this.cdr.detectChanges(); // Wywołanie detekcji zmian po załadowaniu każdego avatara
            };
  
            reader.readAsDataURL(blob);
          }

          // Dodajemy pobieranie liczby ukończonych kursów dla każdego użytkownika
          console.log('user.id ',user.id)
          this.yourCoursesService.getCompletedCoursesCountForUser(user.id).subscribe(
            (completedCoursesData) => {
              user.completedCoursesCount = completedCoursesData[0].completed_courses_count; // Zakładamy, że takie pole jest zwracane z backendu
              console.log('user.completedCoursesCount ',user.completedCoursesCount)
              this.cdr.detectChanges(); // Może być potrzebne, jeśli zmiany nie są wykrywane automatycznie
            }
          );
        });
        this.isOpenArray = Array(usersData.length).fill(false);
      },
      (error) => {
        console.error('Error fetching active courses info', error);
      }
    );
  }
  

  deleteUser(userId: number) {
    if(confirm('Are you sure you want to delete this user?' +userId)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log(response);
          alert('User deleted successfully');
          this.loadUsers(); // Ponowne ładowanie listy użytkowników, jeśli jest potrzebne
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('There was an error deleting the user');
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
  
  sendInvitationsAdmin(): void {
    if (this.emailAddresses.length > 0) {
      this.emailInvitationService
        .sendInvitationsAdmin(this.emailAddresses)
        .subscribe({
          next: (response) => {
            console.log("Zaproszenia wysłane przez admina", response);
            this.closePopup(); // Zamknij modal i wyczyść listę po pomyślnym wysłaniu
          },
          error: (error) => {
            console.error("Błąd podczas wysyłania zaproszeń przez admina", error);
          },
        });
    } else {
      alert("Proszę dodać przynajmniej jeden adres e-mail.");
    }
  }
  
  
}
