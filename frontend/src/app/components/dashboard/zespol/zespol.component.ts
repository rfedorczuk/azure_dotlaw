// import { ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
// import { YourCoursesService } from "../_core/_services/your-courses.service";
// import { EmailInvitationService } from "../_core/_services/email-invitation.service";
// import { AuthService } from "../../pages/core/service/auth.service";
// import { UserService } from "../../pages/core/service/user.service";

// interface User {
//   id: number;
//   name: string;
//   avatar: string | null;
//   created_at: string; // Assuming created_at is a string. Adjust accordingly.
//   courseCount: number;
//   completedCoursesCount?: number; // Make optional if not always present.
//   isExpanded: boolean; // For toggling row expansion.
// }


// @Component({
//   selector: "app-zespol",
//   templateUrl: "./zespol.component.html",
//   styleUrls: ["./zespol.component.scss"],
// })
// export class ZespolComponent implements OnInit {
//   users: User[] = [];
//   usersCount: number = 0;

//   emailAddresses: string[] = [];
//   inputValue: string = "";
//   // Component code
//   public isOpenArray: boolean[] = [false, false, false, false, false]; // Initialize with the number of dropdowns you have

//   constructor(
//     private authService: AuthService,
//     private userService: UserService,
//     private yourCoursesService: YourCoursesService,
//     private emailInvitationService: EmailInvitationService,
//     private cdr: ChangeDetectorRef,
//   ) {}

//   toggleDropdown(clickedIndex: number): void {
//     this.isOpenArray = this.isOpenArray.map((_, index) =>
//       index === clickedIndex ? !this.isOpenArray[index] : false
//     );
//   }

//   @HostListener("document:click", ["$event"])
//   onDocumentClick(event: MouseEvent): void {
//     const dropdowns = document.querySelectorAll(".dropdown");

//     dropdowns.forEach((dropdown, index) => {
//       const button = dropdown.querySelector(".btn");
//       if (!dropdown.contains(event.target as Node)) {
//         this.isOpenArray[index] = false;
//       }
//     });
//   }

//   // Add an array to track which rows are expanded
//   expandedRows: Set<number> = new Set<number>();

//   toggleRow(index: number): void {
//     if (this.expandedRows.has(index)) {
//       this.expandedRows.delete(index);
//     } else {
//       this.expandedRows.add(index);
//     }
//   }

//   isRowExpanded(index: number): boolean {
//     return this.expandedRows.has(index);
//   }


//   //  Popup
//   isOpen = false;
//   openPopup(): void {
//     this.isOpen = true;
//   }

//   toggleExpansion(index: number): void {
//     // This toggles the expansion state of a row when it's clicked
//     this.users[index].isExpanded = !this.users[index].isExpanded;
//   }

//   ngOnInit() {
//     this.getUsersByCompany();
//   }

//   closePopup(): void {
//     this.isOpen = false;
//     this.emailAddresses = []; // Czyszczenie listy adresów e-mail
//     this.inputValue = ""; // Opcjonalnie, czyści również pole wprowadzania, jeśli jest otwarte
//   }

//   handleInput(event: any): void {
//     const value = event.target.value.trim(); // Przycinanie białych znaków na końcach
//     if (value && value.includes(",")) {
//       const emails = value
//         .split(",")
//         .map((email: string) => email.trim())
//         .filter((email: any) => email); // Usuwamy puste ciągi
//       this.emailAddresses = [...this.emailAddresses, ...emails];
//       this.inputValue = ""; // Czyści pole wprowadzania
//     } else {
//       this.inputValue = value;
//     }
//   }

//   removeEmail(index: number): void {
//     this.emailAddresses.splice(index, 1); // Usuń adres e-mail
//   }

//   sendInvitations(): void {
//     const companyId = this.authService.getUserData().companyId; // Pobierz companyId z serwisu autoryzacji
//     if (this.emailAddresses.length > 0 && companyId) {
//       this.emailInvitationService
//         .sendInvitations(this.emailAddresses, companyId)
//         .subscribe({
//           // Logika obsługi odpowiedzi i błędów...
//         });
//     } else {
//       alert("Proszę dodać przynajmniej jeden adres e-mail.");
//     }
//   }

//   getUsersByCompany() {
//     const companyId = this.authService.getUserData();
//     this.yourCoursesService.getUsersByCompany(companyId.companyId).subscribe(
//       (data) => {
//        // this.users = data.users;
//         //   console.log('this.users ',this.users)
//         this.users = data.users.map(user => ({ ...user, isExpanded: false }));
//         this.usersCount = data.usersCount;
//         this.users.forEach((user) => {
//           console.log("user ", user.id);
//           this.yourCoursesService
//             .getCompletedCoursesCountForUser(user.id)
//             .subscribe((completedCoursesData) => {
//               user.completedCoursesCount =
//                 completedCoursesData[0].completed_courses_count; // Zakładając, że takie pole jest zwracane z backendu
//             });
//         });
//       },
//       (error) => {
//         console.error("Błąd podczas pobierania danych użytkowników:", error);
//       }
//     );
//   }

//   deleteUser(userId: number) {
//     if(confirm(`Are you sure you want to delete this user? ${userId}`)) {
//       this.userService.deleteUser(userId).subscribe({
//         next: (response) => {
//           console.log(response);
//           alert('User deleted successfully');
//           this.getUsersByCompany();
//           this.cdr.detectChanges();
//         },
//         error: (error) => {
//           console.error('Error deleting user:', error);
//           alert('There was an error deleting the user');
//         }
//       });
//     }
//   }
  
// }

import { ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
import { YourCoursesService } from "../_core/_services/your-courses.service";
import { EmailInvitationService } from "../_core/_services/email-invitation.service";
import { AuthService } from "../../pages/core/service/auth.service";
import { UserService } from "../../pages/core/service/user.service";
import { catchError, forkJoin, map, of } from "rxjs";
import { ExamService } from "../_core/_services/exam.service";
import { EventTypes } from "../_core/_models/event-types";
import { ToastService } from "../_core/_services/toast.service";

interface UserCourse {
  id: number;
  course_id: number;
  title: string;
  status: string;
  enrollment_date: string;
  completion_date: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string | null;
  created_at: string;
  courseCount: number;
  completedCoursesCount?: number;
  isExpanded: boolean;
  courses?: UserCourse[]; // Opcjonalne pole do przechowywania kursów użytkownika
}




@Component({
  selector: "app-zespol",
  templateUrl: "./zespol.component.html",
  styleUrls: ["./zespol.component.scss"],
})
export class ZespolComponent implements OnInit {
  users: User[] = []; // Use the User interface
  usersCount: number = 0;

  emailAddresses: string[] = [];
  inputValue: string = "";
  public isOpenArray: boolean[] = [false, false, false, false, false];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private yourCoursesService: YourCoursesService,
    private examService: ExamService,
    private emailInvitationService: EmailInvitationService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  toggleDropdown(clickedIndex: number): void {
    this.isOpenArray = this.isOpenArray.map((_, index) =>
      index === clickedIndex ? !this.isOpenArray[index] : false
    );
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach((dropdown, index) => {
      if (!dropdown.contains(event.target as Node)) {
        this.isOpenArray[index] = false;
      }
    });
  }

  expandedRows: Set<number> = new Set<number>();

  toggleRow(index: number): void {
    const isExpanded = this.users[index].isExpanded;
    // Najpierw zwiń wszystkie wiersze
    this.users.forEach((user, i) => {
      this.users[i].isExpanded = false;
      if (!isExpanded && i === index) {
        // Rozwiń kliknięty wiersz tylko jeśli był wcześniej zwinięty
        this.users[index].isExpanded = true;
        // Ładuj kursy tylko jeśli nie zostały wcześniej załadowane
        if (!this.users[index].courses) {
          this.yourCoursesService.getUserCourses(this.users[index].id).subscribe((data) => {
            this.users[index].courses = data.courses;
            this.cdr.detectChanges(); // Wywołaj detekcję zmian
          });
        }
      }
    });
    this.cdr.detectChanges(); // Dodatkowo wywołaj detekcję zmian po aktualizacji stanu
  }
  
  
  

  isRowExpanded(index: number): boolean {
    return this.expandedRows.has(index);
  }

  isOpen = false;
  openPopup(): void {
    this.isOpen = true;
  }

  ngOnInit() {
    this.getUsersByCompany();
  }

  closePopup(): void {
    this.isOpen = false;
    this.emailAddresses = [];
    this.inputValue = "";
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement; // Cast the event target to HTMLInputElement
    const value = target.value.trim();
    if (value && value.includes(",")) {
      // Explicitly type 'email' as 'string' to resolve the TypeScript warning
      const emails = value.split(",").map((email: string) => email.trim()).filter((email: string) => email);
      this.emailAddresses = [...this.emailAddresses, ...emails];
      this.inputValue = "";
    } else {
      this.inputValue = value;
    }
  }
  

  removeEmail(index: number): void {
    this.emailAddresses.splice(index, 1);
  }

  sendInvitations(): void {
    const companyId = this.authService.getUserData().companyId;
    if (this.emailAddresses.length > 0 && companyId) {
      this.emailInvitationService.sendInvitations(this.emailAddresses, companyId).subscribe({
        // Response handling...
      });
    } else {
      alert("Proszę dodać przynajmniej jeden adres e-mail.");
    }
  }

  getUsersByCompany() {
    const companyId = this.authService.getUserData().companyId;
    this.yourCoursesService.getUsersByCompany(companyId).subscribe({
      next: (data) => {
        this.users = data.users.map((user: any) => ({
          ...user,
          isExpanded: false, // Dodajemy flagę bezpośrednio tutaj
        }));
        this.usersCount = data.usersCount;
        console.log('this.users ', this.users); // Wyświetlamy zaktualizowaną listę użytkowników
  
        this.users.forEach((user, index) => {
          this.yourCoursesService.getCompletedCoursesCountForUser(user.id)
            .subscribe({
              next: (completedCoursesData) => {
                const count = completedCoursesData[0].completed_courses_count; // Założenie, że takie pole jest zwracane
                this.users[index] = {
                  ...this.users[index],
                  completedCoursesCount: count,
                };
                // W razie potrzeby, użyj ChangeDetectorRef do aktualizacji widoku
                this.cdr.detectChanges();
                // this.cdr.markForCheck(); // Odkomentuj, jeśli potrzebujesz ręcznie wywołać detekcję zmian
              },
              error: (error) => console.error(`Error fetching completed courses for user ${user.id}`, error),
            });
        });
      },
      error: (error) => {
        console.error("Błąd podczas pobierania danych użytkowników:", error);
      },
    });
  }
  
  downloadCertificate(userId: number, courseId: number): void {
    this.examService.getCertificateBlob(userId, courseId).subscribe(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `certificate-${courseId}.pdf`; // Dostosuj nazwę pliku wg potrzeb
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    }, error => {
      console.error('Error downloading certificate:', error);
    });
  }

  downloadAllCertificates() {
    const companyId = this.authService.getUserData().companyId;
    this.examService.downloadAllCertificates(companyId).subscribe(data => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'certificates.zip';
      link.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading certificates:', error);
    });
  }
  
  

  deleteUser(userId: number): void {
    if (confirm(`Are you sure you want to delete this user? ${userId}`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          alert('User deleted successfully');
          this.getUsersByCompany();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('There was an error deleting the user');
        }
      });
    }
  }

  sendCourseReminder(userId: number, userEmail: string, courseId: number, reminderType: 'start' | 'finish') {
    this.examService.sendReminder(userId, userEmail, courseId, reminderType).subscribe({
      next: () => this.toastService.showToast(EventTypes.Success, 'Suckes', 'Przypomnienie zostało wysłane do użytkownika') ,
      error: (error) => {
        console.error('Wystąpił błąd przy wysyłaniu przypomnienia:', error);
        this.toastService.showToast(EventTypes.Success, 'Suckes', 'Przypomnienie nie zostało wysłane');
        console.log(userId, userEmail, courseId, reminderType)
      }
    });
  }
  
}

// Remember to adjust imports based on your actual file structure.
