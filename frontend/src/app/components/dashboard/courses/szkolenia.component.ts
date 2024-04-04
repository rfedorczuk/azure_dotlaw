import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { YourCoursesService } from '../_core/_services/your-courses.service';
import { AuthService } from '../../pages/core/service/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Player from '@vimeo/player';
import { ProgressService } from '../_core/_services/progress.service';
import { CourseInteractionService } from '../_core/_services/course-interaction.service';
import { CourseCodeService } from '../_core/_services/course-code.service';
import { ToastService } from '../_core/_services/toast.service';
import { CourseSelectionService } from '../_core/_services/course-selection.service';
import { EventTypes } from '../_core/_models/event-types';


@Component({
  selector: 'app-szkolenia',
  templateUrl: './szkolenia.component.html',
  styleUrls: ['./szkolenia.component.scss']
})
export class SzkoleniaComponent implements OnInit {
	EventTypes = EventTypes;
	@ViewChildren('dropdown')
	dropdownElementRefs!: QueryList<ElementRef>;
	  
	@ViewChild('vimeoPlayer', { static: false }) vimeoPlayer?: ElementRef;
	userCourses: any[] = [];
	canAccessTeam: boolean = false;
	isTableVisible: boolean = true; // Kontroluje widoczność tabeli
	isPlayerVisible: boolean = false; // Kontroluje widoczność odtwarzacza wideo
	currentVideoUrl: string = '';
	course: any;
    player: any;
	code: string = '';
toastMessage = '';
    videoUrl: any;
    courseVimeoId: any;
	userId: any;
	selectedCourseDetails: any = null;
	course_id: number = 0;
	user_id: number = 0;
	//currentVideoUrl: SafeResourceUrl | null;

//  Popup
isOpen = false;
openPopup(): void {
	this.isOpen = true;
}
closePopup(): void {
	this.isOpen = false;
}
 constructor(
	private yourCoursesService: YourCoursesService,
	private router: Router,
	private authService: AuthService,
	private courseSelectionService: CourseSelectionService,
	private courseCodeService: CourseCodeService,
	public toastService: ToastService,
	private progressService: ProgressService,
	private courseInteractionService: CourseInteractionService,
	private sanitizer: DomSanitizer,
	private cdr: ChangeDetectorRef) {
		
	}

	ngOnInit() {
		this.canAccessTeam = this.authService.hasRole('manager') || 
		this.authService.hasRole('admin') || 
		this.authService.hasRole('superadmin');
		this.loadUserCourses();

		// const selectedCourseTitle = this.courseSelectionService.getSelectedCourseTitle();
		// alert('selectedCourseTitle '+typeof(selectedCourseTitle))
		// if (selectedCourseTitle) {
		// 	alert('true')
		//   this.openCourseDetails(selectedCourseTitle);
		//   this.courseSelectionService.clearSelectedCourse(); // Opcjonalnie, wyczyść wybrany kurs po użyciu
		// }

		// this.courseInteractionService.currentCourseTitle.subscribe(title => {
		// 	alert('title '+title)
		// 	if (title) {
		// 	  this.openCourseDetails(title);
		// 	}
		//   });
	  }

	  
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

// Przykład metody w AuthService (dodaj do swojego serwisu, jeśli potrzebujesz)

  handleButtonClick() {
    this.courseCodeService.addCourseWithCode(this.code, this.userId.userId).subscribe({
        next: (response) => {
            console.log('Kurs został dodany:', response);
            this.loadUserCourses();
            this.closePopup();
            this.code = '';
            // Wywołanie toastu o sukcesie
            this.toastService.showToast(EventTypes.Success, 'Suckes', 'Kurs został dodany do Twojego konta');

        },
        error: (error) => {
            console.error('Wystąpił błąd:', error);
            // Wywołanie toastu o błędzie
			this.toastService.showToast(EventTypes.Error, 'Błąd', 'Błędny kod kursu, skontaktuj się z menadżerem swojej organizacji');
        }
    });
}

  
  

	//   handleButtonClick() {
    //   this.navigateToOtherPage();
	//   }
	// handleButtonClick(code: string) {
	// 	const userId = this.userId; // Upewnij się, że userId jest dostępne w komponencie
	// 	this.courseCodeService.addCourseWithCode(code, userId).subscribe({
	// 	  next: (response) => {
	// 		// Obsługa sukcesu, np. wyświetlenie komunikatu o powodzeniu i odświeżenie listy kursów użytkownika
	// 		console.log('Kurs został dodany:', response);
	// 		this.loadUserCourses(); // Ponowne załadowanie kursów użytkownika
	// 		this.closePopup(); // Zamknięcie popupa
	// 	  },
	// 	  error: (error) => {
	// 		// Obsługa błędów, np. wyświetlenie komunikatu o błędzie
	// 		console.error('Wystąpił błąd:', error);
	// 	  }
	// 	});
	//   }
	  

	  onVideoUrlChange(newUrl: string) {
		this.currentVideoUrl = newUrl;
	  }

	  loadUserCourses() {
		const userData = this.authService.getUserData();
		if (userData && userData.userId) {
		  this.userId = userData.userId;
		  this.yourCoursesService.getUserCourses(this.userId).subscribe(
			(courses) => {
			  this.userCourses = courses.courses;
			  console.log('userCourses ', JSON.stringify(this.userCourses));
	  
			  // Po załadowaniu kursów, sprawdź czy jest wybrany kurs
			  this.checkForSelectedCourse();
			},
			(error) => {
			  console.error('Error loading user courses', error);
			}
		  );
		} else {
		  console.error('User is not authenticated');
		}
	  }
	  checkForSelectedCourse() {
  const selectedCourseTitle = this.courseSelectionService.getSelectedCourseTitle();
  console.log('selectedCourseTitle '+ typeof(selectedCourseTitle));
  if (selectedCourseTitle) {
    console.log('true');
    this.openCourseDetails(selectedCourseTitle);
    this.courseSelectionService.clearSelectedCourse(); // Opcjonalnie, wyczyść wybrany kurs po użyciu
  }
}
	//   loadUserCourses() {
	// 	const userData = this.authService.getUserData();
	// 	//alert('userData.userId '+userData.userId)
	// 	if (userData && userData.userId) {
	// 	  this.userId = userData.userId;
	// 	//  alert('alert '+this.userId);
	// 	  this.yourCoursesService.getUserCourses(this.userId).subscribe(
	// 		(courses) => {
	// 		  this.userCourses = courses.courses;
	// 		//  alert('userCourses '+this.userCourses)
	// 		  console.log('userCourses ',JSON.stringify(this.userCourses))
	// 		},
	// 		(error) => {
	// 		  console.error('Error loading user courses', error);
	// 		}
	// 	  );
	// 	} else {
	// 	  console.error('User is not authenticated');
	// 	}
	//   }
	 
	  openCourseDetails(courseTitle: string) {
	//	alert('courseTitle '+courseTitle)
		const selectedCourse = this.userCourses.find(c => c.title === courseTitle);
		//alert('selectedCourse '+selectedCourse)
		
		if (selectedCourse && selectedCourse.course_id) {
		  this.course_id = selectedCourse.course_id;
		  this.user_id = this.userId;
	  
		  this.yourCoursesService.getCourseDetails(selectedCourse.course_id).subscribe(
			(courseDetails) => {
			  if (courseDetails && courseDetails.data) {
				// Przygotuj lekcje na podstawie danych otrzymanych z serwera
				
				const lessons = courseDetails.data.map((lesson: {
					user: any; uri: any; name: any; description: any; player_embed_url: any; duration: any; 
}) => ({
				  uri: lesson.uri,
				  name: lesson.name,
				  author: lesson.user.name,
				  description: lesson.description,
				  rawVideoUrl: lesson.player_embed_url,
				  duration: lesson.duration
				}));
	  
				// Ustaw szczegóły kursu oraz lekcje w stanie komponentu
				this.selectedCourseDetails = {
				  ...courseDetails, // Zachowaj pozostałe szczegóły kursu
				  lessons: lessons   // Dodaj przetworzone lekcje
				};

				//console.log('selectedCourseDetails ',JSON.stringify(this.selectedCourseDetails))
	  
				// Ustaw flagi dla UI
				this.isTableVisible = false;
				this.isPlayerVisible = true;
	  
				// Wywołaj detekcję zmian
				this.cdr.detectChanges();
			  }
			},
			error => {
			  console.error('Error fetching course details:', error);
			}
		  );
		} else {
		  console.error('Selected course is undefined or does not have a course_id');
		}
	  }
	
	  backToTable() {
		this.isPlayerVisible = false;
		this.isTableVisible = true;
	  }
  
}
 