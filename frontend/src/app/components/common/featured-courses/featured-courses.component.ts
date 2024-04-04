import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { CoursesService } from '../../pages/core/service/courses.service';
import { LibraryDurationService } from '../../pages/core/service/library-duration.service';

// Ensure Swiper uses required modules


@Component({
  selector: 'app-featured-courses',
  templateUrl: './featured-courses.component.html',
  styleUrls: ['./featured-courses.component.scss']
})
export class FeaturedCoursesComponent implements OnInit {
  courses: any[] = [];
  mySwiper!: Swiper; // Using definite assignment assertion

  constructor(
    public router: Router,
    private coursesService: CoursesService,
    private libraryDurationService: LibraryDurationService) {
    // Swiper instance will be assigned later
  }

  ngOnInit() {
    this.coursesService.getCoursesFromVimeo().subscribe(data => {
      this.courses = data.data;
      this.initializeSwiper();
      this.courses.forEach(course => {
        const libraryId = course.uri.split('/').pop(); // Wyodrębnianie ID kursu
        console.log('libraryId ', libraryId);
  
        // Ustawienie ścieżki do obrazu kursu lub obrazu domyślnego, jeśli obraz kursu nie istnieje
        const imagePath = `assets/images/features/${libraryId}.png`;
        course.imageUrl = imagePath; // Przypuszczamy, że obraz istnieje
  
        this.libraryDurationService.getDuration(libraryId).subscribe(duration => {
          course.duration = duration; // Przypisanie czasu trwania do kursu
          console.log('course.duration ', course.duration);
        });
      });
    }, error => {
      console.error('Wystąpił błąd podczas pobierania kursów', error);
    });
  }
  

  ngAfterViewInit(): void {
    // This method is now empty because Swiper initialization is moved to initializeSwiper
  }

  private initializeSwiper() {
    // Delay Swiper initialization to ensure DOM elements are ready
    setTimeout(() => {
      this.mySwiper = new Swiper('.swiper-container', {
        speed: 400,
        loop: true,
        spaceBetween: 25,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        slidesPerView: 3,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }
      });
    }, 0);
  }

  setDefaultImage(event: any) {
    event.target.src = 'assets/images/features/feature3.jpg'; // Ścieżka do obrazu domyślnego
  }
  


}
