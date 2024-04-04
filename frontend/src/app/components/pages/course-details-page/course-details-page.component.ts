import { ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CoursesService } from '../core/service/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../core/service/user.service';
import { AuthService } from '../core/service/auth.service';
import { BasketService } from '../core/service/basket.service';
import { ToastStateService } from '../../dashboard/_shared/toastService/toast-state.service';

declare const Vimeo: any;

@Component({
    selector: 'app-course-details-page',
    templateUrl: './course-details-page.component.html',
    styleUrls: ['./course-details-page.component.scss']
})
export class CourseDetailsPageComponent implements OnInit {
    @ViewChild('vimeoPlayer', { static: false }) vimeoPlayer?: ElementRef;
    course: any;
    player: any;
    videoUrl: any;
    courseVimeoId: any;
    courseVideoVimeoId: any;
    showMessage = false;
    isOpen = false;
    isUserEnrolled: boolean = false;
    price: any;
    title: string = '';
    isLoading: boolean = true; 

    constructor(
        private route: ActivatedRoute,
        private coursesService: CoursesService,
        private userService: UserService,
        private authService: AuthService,
        private sanitizer: DomSanitizer,
        private basketService: BasketService,
        private changeDetectorRef: ChangeDetectorRef,
        private toastStateService: ToastStateService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const courseId = params.get('courseId');
           // alert('courseId '+courseId)
            
            if (courseId) {
                this.loadCourseDetails(courseId);
    
                if (this.authService.isAuthenticated()) {
                    this.checkEnrollment();
                }
            }
        });
    }

    openVideoPopup(): void {
        console.log('this.course.vimeo_video_id openVideoPopup ',this.courseVimeoId)
        this.isOpen = true;
        this.changeDetectorRef.detectChanges();
    
        setTimeout(() => {
            if (!this.player && this.course && this.courseVimeoId && this.vimeoPlayer) {
                this.initializeVimeoPlayer();
            }
        }, 0);
    }
    
    private initializeVimeoPlayer() {
        console.log('this.course.vimeo_video_id ',this.courseVimeoId, ' this.videoUrl ',this.videoUrl)
        if (this.vimeoPlayer?.nativeElement) {
            this.player = new Vimeo.Player(this.vimeoPlayer.nativeElement, {
                id: this.courseVideoVimeoId,
                url: this.videoUrl,
                autoplay: false,
                controls: true
            });
            console.log(this.player)
    
            this.player.on('timeupdate', (data: { seconds: number; }) => {
                if (data.seconds >= 30) {
                    this.showPurchaseMessage();
                }
            });
        }
    }



    private loadCourseDetails(courseId: string) {
     
      //  alert('courseId ' + courseId)
        this.coursesService.getCourseDetails(courseId).subscribe(
            data => {
              
                // Zakładając, że `data` jest obiektem zawierającym pole `data` będące tablicą
                const lessons = data.data; // lub bezpośrednio data, jeśli API zwraca tablicę
                console.log('this.isLoading = true; ',this.isLoading)
               
                console.log('lessons ',lessons)
                this.price = data.price;
                if (lessons && lessons.length > 0) {
                    
                    const lastLesson = lessons[lessons.length - 1]; // Pobierz ostatnią lekcję
                    this.course = lastLesson; // Przypisz ostatnią lekcję do `course`
                    if(this.course){
                        this.isLoading = false;
                    }
                   // console.log(JSON.stringify(this.course));
                    this.courseVimeoId = courseId;
                    this.courseVideoVimeoId = lastLesson.uri.split('/').pop();
                    console.log('courseVideoVimeoId ',this.courseVideoVimeoId)
                    //this.course.uri.split('/').pop();
                   // console.log('lessons ',lessons)
                    this.title = lessons[0].name
                    console.log('this.course.player_embed_url ',this.course.player_embed_url)
                //    alert('courseVimeoId '+this.courseVimeoId)
                    this.videoUrl = this.course.player_embed_url;
                }
            },
            error => {
                console.error('Error loading course details', error);
                this.isLoading = false;
            }
        );
    }
    // CourseDetailsPageComponent

purchaseCourse() {
    this.changeDetectorRef.detectChanges();
    if (!this.authService.isAuthenticated()) {
        // Zapisz intencję zakupu kursu do późniejszego użycia po zalogowaniu
        this.saveCourseIntentForLater(this.courseVimeoId);
        this.router.navigate(['/profile-authentication']); // Przekierowanie do strony logowania
        return;
    }
  
    // Pobierz profil użytkownika
    this.userService.getProfile().subscribe(
        (userProfile) => {
            const userId = userProfile.id;
            const courseId = this.courseVimeoId;
            const amount = this.price;
  
            console.log('Adding course to basket', { userId, courseId, amount });
  
            // Dodaj kurs do koszyka
            this.basketService.addToBasket(courseId, amount);
  
            console.log('Course added to basket successfully');
            this.toastStateService.setShowPurchaseSuccess(true);
            this.router.navigate(['/koszyk']);
        },
        (error) => {
            console.error('Error fetching user profile', error);
        }
    );
  }
  
  // Metoda wywoływana po zalogowaniu się użytkownika
  continuePurchaseAfterLogin() {
    console.log('continuePurchaseAfterLogin ')
    this.changeDetectorRef.detectChanges();
    const courseId = this.authService.retrieveCourseIntent();
    if (courseId) {
        console.log('courseId ',courseId)
      this.userService.getProfile().subscribe(
        
        (userProfile) => {
                this.changeDetectorRef.detectChanges();
          const userId = userProfile.id;
          const amount = this.price; // Zakładam, że masz cenę kursu dostępną w komponencie
  
          // Dodaj kurs do koszyka
          this.basketService.addToBasket(courseId.toString(), amount);
  
          // Przekierowanie do strony koszyka
          this.router.navigate(['/koszyk']);
        },
        (error) => {
          console.error('Error fetching user profile', error);
        }
      );
    }
  }
  
      
      // Metoda do zapisania intencji zakupu kursu
      saveCourseIntentForLater(courseId: number) {
        localStorage.setItem('courseIntent', courseId.toString());
      }
      
      // Metoda do pobrania zapisanej intencji zakupu kursu
      retrieveCourseIntent(): number | null {
        const courseId = localStorage.getItem('courseIntent');
        if (courseId !== null) {
          localStorage.removeItem('courseIntent');
          return parseInt(courseId, 10);
        }
        return null;
      }
      
      // Wywoływana po zalogowaniu, aby kontynuować zakup
    //   continuePurchaseAfterLogin() {
    //     const courseId = this.retrieveCourseIntent();
        
    //     if (courseId !== null) {
    //       this.purchaseCourse();
    //     } else {
    //       // Przekierowanie do domyślnej strony, jeśli nie ma intencji zakupu
    //       this.router.navigate(['/default-route']);
    //     }
    //   }
      
    
    
    enrollInCourse(userId: number, courseId: number) {
        console.log('Attempting to enroll in course', { userId, courseId });
    
        this.coursesService.enrollUser(userId, courseId).subscribe({
            next: (response) => console.log('Enrolled successfully', response),
            error: (error) => console.error('Error enrolling in course', error)
        });
    }
    
    checkEnrollment() {
        const userId = this.authService.getUserData().userId;
        //console.log(JSON.stringify(this.authService.getUserData())) // Pobierz ID użytkownika z serwisu autentykacji
        this.coursesService.checkIfUserEnrolled(userId, this.courseVimeoId).subscribe(
          response => {
            this.isUserEnrolled = response.enrolled;
          },
          error => {
            console.error('Error checking course enrollment', error);
          }
        );
      }
    
    closeVideoPopup(): void {
        this.isOpen = false;
        if (this.player) {
            this.player.pause();
        }
    }

    showPurchaseMessage(): void {
        if (this.player) {
            this.player.pause();
        }
        this.showMessage = true;
        this.changeDetectorRef.detectChanges();
    }
    
    

    // Tabs
    currentTab = 'tab1';
    switchTab(event: MouseEvent, tab: string) {
        event.preventDefault();
        this.currentTab = tab;
    }

    // Accordion
    contentHeight: number = 0;
    openSectionIndex: number = -1;

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
}
