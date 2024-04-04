import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { YourCoursesService } from '../_core/_services/your-courses.service';
import { AuthService } from '../../pages/core/service/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProgressService } from '../_core/_services/progress.service';
import { CourseInteractionService } from '../_core/_services/course-interaction.service';
import { combineLatest } from 'rxjs';
import { CourseLimitService } from '../_core/_services/course-limit.service';


@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit{
	@ViewChildren('dropdown')
	dropdownElementRefs!: QueryList<ElementRef>;
	
	companies: any[] = [];
selectedCompanies: { [key: number]: boolean } = {};

	userCourses: any[] = [];
	coursesCountInfo: any[] = [];
	canAccessTeam: boolean = false;
	isTableVisible: boolean = true; // Kontroluje widoczność tabeli
	isPlayerVisible: boolean = false; // Kontroluje widoczność odtwarzacza wideo
	currentVideoUrl: string = '';
  userCoursesCount: number = 0;
  userLimit: number = 0;
	course: any;
    player: any;
    videoUrl: any;
    courseVimeoId: any;
	userId: any;
	selectedCourseDetails: any = null;
  companyId: any;
  isCodeGenerateOpen = false; // Kontroluje widoczność modału generowania kodu\
  isSetUserLimitPopupOpen: boolean = false;
  selectedCourseId: number | null = null;


	//currentVideoUrl: SafeResourceUrl | null;

//  Popup
isAddUserPopupOpen = false;
isOpen = false;
openPopup(): void {
	this.isOpen = true;
}
closePopup(): void {
	this.isOpen = false;
}

openCodeGeneratePopup(): void {
	this.isCodeGenerateOpen = true;
  }
  
  closeCodeGeneratePopup(): void {
	this.isCodeGenerateOpen = false;
  }

  openCodeGeneratePopupForCourse(courseId: number): void {
	this.selectedCourseId = courseId; // Ustaw wybrany courseId
	this.isCodeGenerateOpen = true; // Otwiera modal do generowania kodu
  }
  
  openAddUserPopup(courseId: number) {
	console.log('open');
	this.selectedCourseId = courseId;
	this.getAllCompanies(this.selectedCourseId);
	console.log('selectedCourseId ', this.selectedCourseId);
	this.isAddUserPopupOpen = true;
	this.cdr.detectChanges(); // Wymusza wykrywanie zmian
  }
  
  closeAddUserPopup() {
	this.isAddUserPopupOpen = false;
  }
  
  toggleCompanySelection(companyId: number) {
	this.selectedCompanies[companyId] = !this.selectedCompanies[companyId];
  }

  // Metoda do otwierania modala ustawiania limitu użytkowników
  openUserLimitModal(courseId: number) {
	this.selectedCourseId = courseId;
	this.userLimit = 0; // Reset wartości
	this.isSetUserLimitPopupOpen = true; // Otwiera modal
  }
  
  // Zaktualizowana metoda zamknięcia modala
  closeSetUserLimitPopup() {
	this.isSetUserLimitPopupOpen = false;
	// Opcjonalnie: Odśwież dane kursu
  }
  

  
  

  
 constructor(
	private yourCoursesService: YourCoursesService,
	private router: Router,
	private authService: AuthService,
	private courseLimitService: CourseLimitService,
	private progressService: ProgressService,
	private courseInteractionService: CourseInteractionService,
	private sanitizer: DomSanitizer,
	private cdr: ChangeDetectorRef) {
		
	}

	async ngOnInit() {
		this.canAccessTeam = 
		this.authService.hasRole('admin') || 
		this.authService.hasRole('superadmin');
		 this.getAllCourses();
	  }

	  
// Component code
/*
@ViewChildren('dropdown')
	dropdownElementRefs!: QueryList<ElementRef>;
	*/

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


  getDismissReason(reason: any): string {
		// Implement your getDismissReason function here
		if (reason === 'cancel') {
		  return 'Canceled';
		}
		return `Dismissed with: ${reason}`;
	  }
	  navigateToOtherPage() {
		// Use the Router to navigate to another route
		this.router.navigate(['dashboard/ochrona']); // Replace 'other-page' with the actual route you want to navigate to
	  }


	  handleButtonClick() {
      this.navigateToOtherPage();
	  }

	  onVideoUrlChange(newUrl: string) {
		this.currentVideoUrl = newUrl;
	  }

	  getAllCompanies(courseId: number) {
		console.log('getAllCompanies ',courseId)
		try {
		 // const courseId = course
		  this.yourCoursesService.getAllCompanies(courseId).subscribe({
			next: (companies) => {
			  this.companies = companies.map(company => ({
				...company,
				selected: company.hasCourse // Ustaw checkbox na zaznaczony, jeśli firma posiada kurs
			  }));
			  console.log('this.companies ',this.companies)
			  this.cdr.detectChanges();
			},
			error: (error) => {
			  console.error('Error loading companies', error);
			}
		  });
		} catch (error) {
		  console.error('Error in subscription', error);
		}
	  }
	  
	  
	  
	addCompaniesToCourse() {
		const selectedCompanyIds = this.companies
		  .filter(company => company.selected)
		  .map(company => company.id);
	  
		if (this.selectedCourseId !== null && selectedCompanyIds.length > 0) {
		  try {
			this.yourCoursesService.assignCompaniesToCourse(this.selectedCourseId, selectedCompanyIds).toPromise();
			this.closeAddUserPopup();
			// Opcjonalnie: odśwież dane kursu lub firm tutaj
		  } catch (error) {
			console.error('Error assigning companies to course', error);
		  }
		} else {
		  console.error('Selected course ID is null or no companies selected.');
		  // Handle the error state appropriately
		}
	  }
	  
    
    getAllCourses() {
      if (this.authService.getUserData()) {
        //this.companyId = this.authService.getUserData().companyId;
        console.log('companyId z getAllCourses: ',this.companyId)
        this.yourCoursesService.getAllCourses().subscribe(
          (courses) => {
            this.userCourses = courses;
            console.log('userCourses ',JSON.stringify(this.userCourses))
          //  this.activeCoursesCount = this.userCourses.length;
          this.userCoursesCount = courses.course_count;
  
         //   console.log('userCoursesCount', this.userCoursesCount);
          },
          (error) => {
            console.error('Error loading compay courses', error);
          }
        );
     } else {
       console.error('User is not authenticated');
      }
    }

	generateAndCreateCourseCode() {
		if (this.selectedCourseId === null) {
		  console.error('No course selected');
		  return;
		}
	  
		// Tutaj załóżmy, że userId jest już dostępne
		const userId = this.authService.getUserData().userId; // Ta metoda powinna zostać zaimplementowana przez Ciebie
	  
		this.yourCoursesService.generateCourseCode(this.selectedCourseId).subscribe({
		  next: (response) => {
			console.log('Course code generated successfully', response);
			this.closeCodeGeneratePopup(); // Zamknij modal po pomyślnym dodaniu kursu
		  },
		  error: (error) => {
			console.error('Error generating course code', error);
		  }
		});
	  }

	  exportReport(course: any): void {
		alert(course)
		this.yourCoursesService.exportCourseReport(course).subscribe(response => {
		  const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
		  const url = window.URL.createObjectURL(blob);
		  window.open(url);
		}, error => {
		  console.error('Error exporting report:', error);
		});
	  }

	  setUserLimitForCourse(courseId: number, userLimit: number) {
		if (courseId === null) {
			console.error('Course ID is null');
			return;
		  }
		this.courseLimitService.setUserLimit(courseId, userLimit).subscribe({
		  next: (response) => {
			console.log('Limit użytkowników ustawiony pomyślnie.', response);
			// Możesz tutaj dodać jakieś powiadomienie dla użytkownika
		  },
		  error: (error) => {
			console.error('Wystąpił błąd podczas ustawiania limitu użytkowników.', error);
		  }
		});
	  }
	  

	navigateToEditTest(courseId: number) {
		console.log('courseId ',courseId)
		this.router.navigate(['/admin-dashboard/create-exam', courseId]);
	  }
  
}
 
