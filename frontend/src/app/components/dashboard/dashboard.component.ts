import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  Renderer2,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../pages/core/service/auth.service";
import { YourCoursesService } from "./_core/_services/your-courses.service";
import { CourseInteractionService } from "./_core/_services/course-interaction.service";
import Player from "@vimeo/player";
import { ProgressService } from "./_core/_services/progress.service";
import { CourseSelectionService } from "./_core/_services/course-selection.service";
import { EventTypes } from "./_core/_models/event-types";
import { ToastService } from "./_core/_services/toast.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("vimeoPlayer", { static: false }) vimeoPlayer?: ElementRef;
  // @ViewChildren('dropdown')
	// dropdownElementRefs!: QueryList<ElementRef>;

  userCoursesCount: number = 0;
  activeCoursesCount: number = 0;
  totalUsersCount: number = 0;
  completedCoursesCount: number = 0;

  isAddUserPopupOpen: boolean = false; // Stan modala dodawania użytkowników
users: any[] = []; // Lista użytkowników (zastąp 'any' odpowiednim typem, jeśli jest dostępny)
selectedUsers: string[] = []; // ID wybranych użytkowników

  currentVideoUrl: string = "";

  canAccessTeam: boolean = false;
  canAccesManager: boolean = false;
  isTableVisible: boolean = true;
  userCourses: any[] = [];
  public isOpenArray: boolean[] = [false, false, false, false, false]; 
  selectedCourseDetails: any = null;
  player: any;
  videoUrl: any;
  courseVimeoId: any;
  userId: any;
  companyId: any;
  selectedCourseId: number | null = null; 


  

  constructor(
    public router: Router,
    private authService: AuthService,
    private courseSelectionService: CourseSelectionService,
    private yourCoursesService: YourCoursesService,
    private toastService: ToastService,
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef,
    private courseInteractionService: CourseInteractionService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {}

  navCollapsed: boolean = false;
  navCollapsedMob = false;
  windowWidth: number = window.innerWidth; // Initialize with the current window width

  ngOnInit(): void {
    this.canAccessTeam =
      this.authService.hasRole("manager") ||
      this.authService.hasRole("admin") ||
      this.authService.hasRole("superadmin");

    if (this.canAccessTeam) {
      this.loadCompanyCourses();
      this.loadCompletedCourses();
      this.loadCompanyUsers();
    } else {
      this.loadUserCourses();
      this.loadCompletedUserCourses();
    }
  }

  toggleDropdown(clickedIndex: number): void {
    this.isOpenArray = this.isOpenArray.map((_, index) =>
      index === clickedIndex ? !this.isOpenArray[index] : false
    );
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown, index) => {
      const button = dropdown.querySelector(".btn");
      if (!dropdown.contains(event.target as Node)) {
        this.isOpenArray[index] = false;
      }
    });
  }

  // Component code
  openAddUserPopup(courseId: number) {
    this.selectedCourseId = courseId;
    this.isAddUserPopupOpen = true;
  }
  
  
  closeAddUserPopup() {
    this.isAddUserPopupOpen = false;
  }

  
  toggleUserSelection(userId: string) {
    const index = this.selectedUsers.indexOf(userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1); // Usuń, jeśli znajduje się na liście
    } else {
      this.selectedUsers.push(userId); // Dodaj, jeśli nie znajduje się na liście
    }
  }
  
  addUsersToCourse() {
    if (this.selectedCourseId !== null && this.selectedUsers.length > 0) {
      this.yourCoursesService.assignUsersToCourse(this.selectedCourseId, this.selectedUsers, this.companyId).subscribe({
        next: (response) => {
          console.log('Users assigned successfully:', response);
          this.selectedUsers = [];
          this.closeAddUserPopup();
          this.toastService.showToast(
            EventTypes.Success,
            "Sukces",
            "Kurs został przypisany prawidłowo!"
          );
        },
        error: (error) => {
          // Wyodrębnianie szczegółowej wiadomości błędu
          const detailedErrorMessage = error.error?.error || "Nieznany błąd";
          this.toastService.showToast(
            EventTypes.Error,
            "Błąd",
            `Kurs nie został przypisany! ${detailedErrorMessage}`
          );
          console.error('Error assigning users to course:', error)
        }
      });
    } else {
      console.error('No course or users selected');
    }
  }
  
  // addUsersToCourse() {
  //   if (this.selectedCourseId !== null && this.selectedUsers.length > 0) {
  //     this.yourCoursesService.assignUsersToCourse(this.selectedCourseId, this.selectedUsers, this.companyId).subscribe({
  //       next: (response) => {
  //         console.log('Users assigned successfully:', response);
  //         this.selectedUsers = []; 
  //         this.closeAddUserPopup();
  //         this.toastService.showToast(
  //           EventTypes.Success,
  //           "Sukces",
  //           "Kurs został przypisany prawidłowo!"
  //         ); 
  //       },
        
  //       error: (error) => {
  //         this.toastService.showToast(
  //           EventTypes.Error,
  //           "Błąd",
  //           "Kurs nie został przypisany!"
  //         ); 
  //         console.error('Error assigning users to course:', error)
  //       }
  //     });
  //   } else {
  //     console.error('No course or users selected');
  //   }
  // }
  
  



  navMobClick() {
    if (
      this.navCollapsedMob &&
      !document
        .querySelector("app-dasnboard-sidebar")
        ?.classList.contains(".active")
    ) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  loadUserCourses() {
    const userData = this.authService.getUserData();
    //alert('userData.userId '+userData.userId)
    if (userData && userData.userId) {
      this.userId = userData.userId;
      this.yourCoursesService.getUserCourses(this.userId).subscribe(
        (courses) => {
          this.userCourses = courses.courses;
          console.log("userCourses ", JSON.stringify(this.userCourses));
          this.userCoursesCount = courses.courseCount;
          this.activeCoursesCount = courses.courseCount;

          // console.log('userCoursesCount ',this.userCoursesCount);
          //  console.log(JSON.stringify(this.userCourses))
        },
        (error) => {
          console.error("Error loading user courses", error);
        }
      );
    } else {
      console.error("User is not authenticated");
    }
  }

  loadCompanyCourses() {
    console.log('lecimy z company')
    if (this.authService.getUserData()) {
      this.companyId = this.authService.getUserData().companyId;
      console.log("companyId: ", this.companyId);
      this.yourCoursesService.getCoursesByCompany(this.companyId).subscribe(
        (courses: any) => {
          // Jawnie określ typ courses jako any lub konkretny typ, który jest zwracany przez funkcję getCoursesByCompany
          console.log(courses.courses);

          // Zliczanie sumy TotalUsers
          this.totalUsersCount = courses.courses.reduce(
            (total: number, course: any) => total + course.TotalUsers,
            0
          );
          //  console.log('Suma TotalUsers:', totalUsersCount);

          this.userCourses = courses.courses;
          this.activeCoursesCount = courses.totalCourses;
          this.userCoursesCount = courses.totalUsers;
        },
        (error) => {
          console.error("Error loading company courses", error);
        }
      );
    } else {
      console.error("User is not authenticated");
    }
  }

  loadCompanyUsers() {
    const companyId = this.authService.getUserData().companyId;
    this.yourCoursesService.getUsersByCompany(companyId).subscribe({
      next: (data) => {
        this.users = data.users;
        console.log('suers ',this.users)
      },
      error: (error) => {
        console.error("Błąd podczas pobierania użytkowników:", error);
      },
    });
  }

  loadCompletedCourses() {
    const companyId = this.authService.getUserData().companyId;
    this.yourCoursesService.getCompletedCourses(companyId).subscribe({
      next: (data) => {
        // Przetwarzaj dane, np. obliczając liczbę ukończonych kursów
        this.completedCoursesCount = data.length; // Przykład, dostosuj do struktury danych
      },
      error: (err) => console.error(err)
    });
  }

  loadCompletedUserCourses() {
    const userId = this.authService.getUserData().userId;
    this.yourCoursesService.getCompletedUserCourses(userId).subscribe({
      next: (data) => {
        //console.log('completedCoursesCount ',this.completedCoursesCount, ' data ',data)
        // Przetwarzaj dane, np. obliczając liczbę ukończonych kursów
        this.completedCoursesCount = data[0].completed_courses_count;
      },
      error: (err) => console.error(err)
    });
  }

  openCourse(title: string) {
    this.courseSelectionService.selectCourse(title);
    this.router.navigate(["/dashboard/szkolenia"]); // Upewnij się, że ścieżka pasuje do Twojej konfiguracji routingu
  }

  backToTable() {
    this.isTableVisible = true;
  }
}
