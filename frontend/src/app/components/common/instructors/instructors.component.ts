import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
@Component({
    selector: 'app-instructors',
    templateUrl: './instructors.component.html',
    styleUrls: ['./instructors.component.scss']
})
export class InstructorsComponent implements AfterViewInit {
    mySwiper!: Swiper; // Using definite assignment assertion
    sectionTitle = [
        {
            subTitle: `Zespół Akademii dotlaw`,
            title: `Poznaj naszych specjalistów`,
            paragraph: `Nasi prawnicy specjalizujący się w prawie korporacyjnym, prawie nowych technologii, własności intelektualnej, podatkach, bezpieczeństwie informacji i ochronie danych osobowych to eksperci w swojej dziedzinie, którzy na co dzień pomagają firmom w rozwiązywaniu skomplikowanych kwestii prawnych. Nie trać czasu na szukanie informacji samodzielnie - zapisz się już dziś i rozwijaj swoje umiejętności przy wykorzystaniu naszej platformy e-learningowej!.`
        }
    ]
    instructorBox = [
        {
            image: `assets/images/instructors/jedrek.png`,
            name: `Jędrzej Stępniowski`,
            designation: `partner, radca prawny`,
            // link: `/instructor-profile`
          
        },
        {
            image: `assets/images/instructors/ola-z.png`,
            name: `Aleksandra Zomerska`,
            designation: `senior associate, adwoka`,
        },
        {
            image: `assets/images/instructors/damian.png`,
            name: `Damian Klimas`,
            designation: `partner`,
           
        },
        {
            image: `assets/images/instructors/dorian.png`,
            name: `Dorian Duda`,
            designation: `head of international desk, adwokat`,
           
        },
        {
            image: `assets/images/instructors/olga.png`,
            name: `Olga Dąbrowska`,
            designation: `senior associate`,
           
        },
        {
            image: `assets/images/instructors/nadia.png`,
            name: `Nadia Kaśkosz`,
            designation: `junior associate`,
           
        },
        {
            image: `assets/images/instructors/maciek.png`,
            name: `Maciej Jany`,
            designation: `junior associate`,
           
        },
        {
            image: `assets/images/instructors/lukasz.png`,
            name: `Łukasz Dej`,
            designation: `senior associate, radca prawny`,
           
        },
        {
            image: `assets/images/instructors/laura.png`,
            name: `Laura Słocka`,
            designation: `junior associate`,
           
        },
        {
            image: `assets/images/instructors/ola-w.png`,
            name: `Aleksandra Woźniak`,
            designation: `paralegal`,
           
        },
        {
            image: `assets/images/instructors/aga-wk.png`,
            name: `Agnieszka Wojtczyk-Kowalska`,
            designation: `associate, radczyni prawna`,
           
        },
        {
            image: `assets/images/instructors/paulina.png`,
            name: `Paulina Wiertelak`,
            designation: `office manager`,
           
        },
        {
            image: `assets/images/instructors/michal.png`,
            name: `Michał Skrzywanek`,
            designation: `partner, radca prawny`,
           
        },
        {
            image: `assets/images/instructors/jarek.png`,
            name: `Jarek Józefowski`,
            designation: `radca prawny`,
           
        },
    ]




    ngAfterViewInit(): void {
        this.mySwiper = new Swiper('.swiper-container', {
            speed: 400,
            loop: true,
            spaceBetween: 20,
            autoplay: {
              delay: 50000,
              disableOnInteraction: false
            },
            slidesPerView: 'auto',
            pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true
            },
            navigation: {  // Add navigation option
              nextEl: '.swiper-button-next',  // Selector for the next button
              prevEl: '.swiper-button-prev'   // Selector for the previous button
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            on: {
                init() {
                    // Your custom initialization logic here
                },
            },
        });
    }
}