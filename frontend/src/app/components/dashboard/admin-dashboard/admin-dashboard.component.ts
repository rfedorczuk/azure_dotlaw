import { AfterViewInit, Component, ElementRef, EventEmitter,Output , Input, Renderer2, OnInit, ViewChild, ChangeDetectorRef, ViewChildren, QueryList, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../pages/core/service/auth.service';
import { YourCoursesService } from '../_core/_services/your-courses.service';
import { CourseInteractionService } from '../_core/_services/course-interaction.service';
import { ProgressService } from '../_core/_services/progress.service';
import { StatisticsDataService } from '../_core/_services/satistics-data.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
 // @ViewChild('vimeoPlayer', { static: false }) vimeoPlayer?: ElementRef;
 @ViewChildren('dropdown')
 dropdownElementRefs!: QueryList<ElementRef>;

 public barChartOptions: ChartOptions = {
  responsive: true,
};
public barChartLabels: string[] = [''];
public barChartType: ChartType = 'bar';
public barChartLegend = true;
public barChartData: ChartDataset[] = [
  { 
    data: [6], 
    label: 'Sprzedaż kursów',
    backgroundColor: 'rgba(130, 94, 243, 0.5)', // Ustawienie koloru tła słupków
    borderColor: 'rgba(130, 94, 243, 0.5)',
  }
];



 
  userCoursesCount: number = 0;
  activeCoursesCount: number = 0;

  currentVideoUrl: string = '';

  canAccessTeam: boolean = false;
  isTableVisible: boolean = true; 
  userCourses: any[] = [];
  selectedCourseDetails: any = null;
  player: any;
  videoUrl: any;
  courseVimeoId: any;
  userId: any;
  companyId: any;
 
  constructor(
    public router: Router,
    private authService: AuthService,
    private yourCoursesService: YourCoursesService,
    private statisticsDataService: StatisticsDataService,
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef,
    private courseInteractionService: CourseInteractionService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    
  ) { }
    
  navCollapsed: boolean = false;
  navCollapsedMob = false;
  windowWidth: number = window.innerWidth; // Initialize with the current window width

ngOnInit(): void {
  this.canAccessTeam = this.authService.hasRole('admin') || 
                       this.authService.hasRole('superadmin');
  
    
                       if (this.canAccessTeam) {
                        this.loadCoursesData();
                        this.loadStatisticsData();
                      }
                  
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
 
navMobClick() {
  if (this.navCollapsedMob && !document.querySelector('app-dasnboard-sidebar')?.classList.contains('.active')) {
    this.navCollapsedMob = !this.navCollapsedMob;
    setTimeout(() => {
      this.navCollapsedMob = !this.navCollapsedMob;
    }, 100);
  } else {
    this.navCollapsedMob = !this.navCollapsedMob;
  }
}

loadCoursesData() {
  if (this.authService.getUserData()) {
   // this.companyId = this.authService.getUserData().companyId;
   // console.log('companyId: ',this.companyId)
    this.yourCoursesService.getAllCourses().subscribe(
      (courses) => {
        this.userCourses = courses;
        console.log('userCourses ',(this.userCourses))
       this.activeCoursesCount = courses.length;
       this.userCoursesCount = courses[0].total_user_count;

       // console.log('userCoursesCount', this.userCoursesCount);
      },
      (error) => {
        console.error('Error loading company courses', error);
      }
    );
  } else {
    console.error('User is not authenticated');
  }
}

loadStatisticsData() {
  this.statisticsDataService.getSalesStatistics().subscribe(data => {
    this.barChartLabels = data.map(item => new Date(item.date).toLocaleDateString('pl-PL'));
    this.barChartData[0].data = data.map(item => item.sales);
  });
}

// loadUserCourses() {
// 		const userData = this.authService.getUserData();
// 		//alert('userData.userId '+userData.userId)
// 		if (userData && userData.userId) {
// 		  this.userId = userData.userId;
// 		  this.yourCoursesService.getUserCourses(this.userId).subscribe(
// 			(courses) => {
// 			  this.userCourses = courses.courses;
//        // console.log('userCourses ',this.userCourses)
//         this.userCoursesCount = courses.courseCount;

//        // console.log('userCoursesCount ',this.userCoursesCount);
// 			//  console.log(JSON.stringify(this.userCourses))
// 			},
// 			(error) => {
// 			  console.error('Error loading user courses', error);
// 			}
// 		  );
// 		} else {
// 		  console.error('User is not authenticated');
// 		}
// 	  }

//     loadCompanyCourses() {
//       if (this.authService.getUserData()) {
//         this.companyId = this.authService.getUserData().companyId;
//         console.log('companyId: ',this.companyId)
//         this.yourCoursesService.getCoursesByCompany(this.companyId).subscribe(
//           (courses) => {
//             this.userCourses = courses.courses;
//             this.activeCoursesCount = this.userCourses.length;
//             this.userCoursesCount = courses.totalUsers;
  
//             console.log('userCoursesCount', this.userCoursesCount);
//           },
//           (error) => {
//             console.error('Error loading company courses', error);
//           }
//         );
//       } else {
//         console.error('User is not authenticated');
//       }
//     }

    // openCourseDetails(courseTitle: string) {
    //   const selectedCourse = this.userCourses.find(c => c.title === courseTitle);
    //   if (selectedCourse && selectedCourse.course_id) {
    //     this.yourCoursesService.getCourseDetails(selectedCourse.course_id).subscribe(
    //     (courseDetails) => {
    //       this.selectedCourseDetails = courseDetails;
    //       console.log('courseDetails.name ',courseDetails.name,
    //        'courseDetails.duration ',courseDetails.duration,
    //        'courseDetails.categories ',courseDetails.categories,
    //        'courseDetails.user.name ',courseDetails.user.name)
    //       this.currentVideoUrl = courseDetails.player_embed_url;
    
    //       this.isTableVisible = false;
    //      // this.isPlayerVisible = true;
    //       this.cdr.detectChanges();
    
    //       this.progressService.getProgress(this.userId, selectedCourse.course_id).subscribe(
    //       response => {
    //         console.log('response.progress', response.progress);
    //         this.initializeVimeoPlayer(response.progress, this.currentVideoUrl, selectedCourse.course_id);
    //       },
    //       error => {
    //         console.error('Error fetching progress:', error);
    //         this.initializeVimeoPlayer(0, this.currentVideoUrl, selectedCourse.course_id);
    //       }
    //       );
    //     },
    //     error => {
    //       console.error('Error fetching course details:', error);
    //     }
    //     );
    //   } else {
    //     console.error('Selected course is undefined or does not have a course_id');
    //   }
    //   }
    
    //   private initializeVimeoPlayer(progressTime: number, videoUrl: string, courseId: number) {
    //   console.log('Initializing Vimeo Player with URL:', videoUrl);
    //   if (!this.vimeoPlayer?.nativeElement) {
    //     console.error('Vimeo player element is not available');
    //     return;
    //   }
    
    //   this.player = new Player(this.vimeoPlayer.nativeElement, {
    //     url: videoUrl,
    //     autoplay: true,
    //     controls: true
    //   });
    
    //   let lastSavedTime = 0;
    //   this.player.ready().then(() => {
    //     return this.player.getDuration().then((duration: number) => {
    //     if (progressTime < duration) {
    //       return this.player.setCurrentTime(progressTime);
    //     } else {
    //       console.warn('Progress time is greater than video duration, starting from the beginning');
    //       return this.player.setCurrentTime(0);
    //     }
    //     });
    //   }).then(() => {
    //     console.log('Time set to:', progressTime);
    //   }).catch((error: any) => {
    //     console.error('Error initializing player:', error);
    //   });
    
    //   this.player.on('timeupdate', (data: { seconds: number }) => {
    //     if (data.seconds - lastSavedTime > 30.000) {
    //     lastSavedTime = data.seconds;
    //     this.progressService.saveProgress(this.userId, courseId, data.seconds)
    //       .subscribe(
    //       () => {
    //         console.log('Progress saved at:', data.seconds);
    //       },
    //       error => {
    //         console.error('Error saving progress:', error);
    //       }
    //       );
    //     }
    //   });
  
      
    //   }	  

    //   backToTable() {
    //     this.isTableVisible = true;
    //     }
    
  
  
}

