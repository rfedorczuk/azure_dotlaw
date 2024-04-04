// import { Component, OnInit } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';
// @Component({
//     selector: 'app-root',
//     templateUrl: './app.component.html',
//     styleUrls: ['./app.component.scss']
// })
// export class AppComponent  implements OnInit {
//     isDashboardPage: boolean = false;
//     title = 'dotlaw';

//     constructor(
//         public router: Router 
//     ) { }

//     ngOnInit() {
//         this.router.events
//           .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
//           .subscribe((event: NavigationEnd) => {
//             this.isDashboardPage = event.url.startsWith('/dashboard');
//           });
//       }
// }

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isDashboardPage: boolean = false;
    isAdminDashboardPage: boolean = false; // Dodaj tę zmienną
    title = 'dotlaw';

    constructor(public router: Router) { }

    ngOnInit() {
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.isDashboardPage = event.url.startsWith('/dashboard');
                this.isAdminDashboardPage = event.url.startsWith('/admin-dashboard'); // Dodaj tę linię
            });
    }
}
