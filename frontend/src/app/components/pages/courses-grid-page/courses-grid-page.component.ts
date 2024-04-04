import { Component, AfterViewInit, ElementRef, HostListener, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { CoursesService } from '../core/service/courses.service';
import Player from "@vimeo/player";
import { LibraryDurationService } from '../core/service/library-duration.service';

@Component({
  selector: 'app-courses-grid-page',
  templateUrl: './courses-grid-page.component.html',
  styleUrls: ['./courses-grid-page.component.scss']
})
export class CoursesGridPageComponent implements AfterViewInit, OnInit {
  @ViewChildren('vimeoPlayer') vimeoPlayers!: QueryList<ElementRef>;
  selectedCourse: string | null = null;
  courses: any[] = [];

  currentPage = 1;
  itemsPerPage = 10; // Ustaw zgodnie z oczekiwaniami

  Math = Math;

  public isLoading = true;
  public isOpen = false;

  constructor(
      private coursesService: CoursesService, 
      private libraryDurationService: LibraryDurationService,
      private renderer: Renderer2, 
      private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
      const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-toggle');
      if (event.target !== dropdown && this.isOpen) {
        this.renderer.removeClass(dropdown.nextElementSibling, 'show');
        this.isOpen = false;
      }
    });
  }

  
  ngOnInit() {
    this.coursesService.getCoursesFromVimeo().subscribe(data => {
      this.courses = data.data;
      console.log('this.coureses ',this.courses)
      if(this.courses){
        this.isLoading = false;
      }
     // this.isLoading = false;
      this.courses.forEach(course => {
        const libraryId = course.uri.split('/').pop();
        console.log('libraryId ', libraryId);
  
        // Ustawienie ścieżki do obrazu kursu lub obrazu domyślnego, jeśli obraz kursu nie istnieje
        const imagePath = `assets/images/features/${libraryId}.png`;
        course.imageUrl = imagePath; // Przypuszczamy, że obraz istnieje
  
        this.libraryDurationService.getDuration(libraryId).subscribe(duration => {
          course.duration = duration;
          console.log('course.duration ', course.duration);
        });
      });
    }, error => {
      console.error('Wystąpił błąd podczas pobierania kursów', error);
    });
  }
  
  
  


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-toggle');
    if (!this.elementRef.nativeElement.contains(event.target) && this.isOpen) {
      this.renderer.removeClass(dropdown.nextElementSibling, 'show');
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-toggle');
    if (!this.isOpen) {
      this.renderer.addClass(dropdown.nextElementSibling, 'show');
      this.isOpen = true;
    } else {
      this.renderer.removeClass(dropdown.nextElementSibling, 'show');
      this.isOpen = false;
    }
  }

  get visibleCourses() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.courses.slice(startIndex, endIndex);
  }
  

  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }

  setDefaultImage(event: any) {
    event.target.src = 'assets/images/features/feature3.jpg';
  }
  
  
}





