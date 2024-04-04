// import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';
// import { AuthService } from '../../pages/core/service/auth.service';

// @Component({
//     selector: 'app-navbar',
//     templateUrl: './navbar.component.html',
//     styleUrls: ['./navbar.component.scss']
// })
// export class NavbarComponent {

//     // Navbar Sticky
//     isSticky: boolean = false;
    
//     // Set default header type
//     headerType: string = 'website';  // Default to website header
//     constructor(private router: Router, private authService: AuthService, private renderer: Renderer2, private elementRef: ElementRef) {
//         // Subscribe to router events to detect route changes
//         this.router.events.pipe(
//             filter(event => event instanceof NavigationEnd)
//         ).subscribe(() => {
//             const routeData = this.router.routerState.root.firstChild?.snapshot.data;
//             this.headerType = routeData && 'header' in routeData ? routeData['header'] : 'website';
//         });
        
//     }

//     @HostListener('window:scroll', ['$event'])
//     checkScroll() {
//         const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
//         if (scrollPosition >= 50) {
//             this.isSticky = true;
//         } else {
//             this.isSticky = false;
//         }
//     }

//     classApplied = false;
//     toggleClass() {
//         this.classApplied = !this.classApplied;
//     }

//     searchClassApplied = false;
//     toggleSearchClass() {
//         this.searchClassApplied = !this.searchClassApplied;
//     }

//     sidebarClassApplied = false;
//     toggleSidebarClass() {
//         this.sidebarClassApplied = !this.sidebarClassApplied;
//     }

//     handleItemClick() {
//         this.removeActiveClass();
//     }

//     removeActiveClass() {
//         const navbar = this.elementRef.nativeElement.querySelector('.navbar-expand-lg');
//         this.renderer.removeClass(navbar, 'active');
//     }

//     getUserName(): string {
//         console.log('username ')
//         const userData = this.authService.getUserData();
//         return userData ? userData.name : ''; // Adjust to use the correct property for the user's name
//     }

//     // Check if user is authenticated
//     isAuthenticated(): boolean {
//         console.log('isAuthenticated ')
//         return this.authService.isAuthenticated();
//     }
// }
import { Component, OnInit, HostListener, ElementRef, Renderer2, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../pages/core/service/auth.service';
import { BasketService } from '../../pages/core/service/basket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    private authSubscription: Subscription = new Subscription();
    private basketSubscription: Subscription = new Subscription();



    isSticky: boolean = false;
    isAuthenticated: boolean = false;
    userName: string = '';
    headerType: string = 'website'; 
    userData: any = null;
    basketCount: number = 0;

    constructor(
        private router: Router, 
        private renderer: Renderer2, 
        private elementRef: ElementRef,
        private authService: AuthService,
        private basketService: BasketService,
        private cdr: ChangeDetectorRef
    ) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            const routeData = this.router.routerState.root.firstChild?.snapshot.data;
            this.headerType = routeData && 'header' in routeData ? routeData['header'] : 'website';
        });
    }

    ngOnInit() {
        this.authSubscription = this.authService.getIsAuthenticated().subscribe(isAuthenticated => {
            this.isAuthenticated = isAuthenticated;
            this.updateUserStatus();
            // Ten fragment już istnieje, tylko upewniamy się, że wszystko jest na miejscu.
        });
        this.basketSubscription = this.basketService.getBasketObservable().subscribe(basket => {
            this.basketCount = basket.length;
            this.cdr.detectChanges(); // Wywołaj detekcję zmian, aby upewnić się, że widok jest aktualizowany.
        });
    }
    

    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    searchClassApplied = false;
    toggleSearchClass() {
        this.searchClassApplied = !this.searchClassApplied;
    }

    sidebarClassApplied = false;
    toggleSidebarClass() {
        this.sidebarClassApplied = !this.sidebarClassApplied;
    }

    handleItemClick() {
        this.removeActiveClass();
    }

    removeActiveClass() {
        const navbar = this.elementRef.nativeElement.querySelector('.navbar-expand-lg');
        this.renderer.removeClass(navbar, 'active');
    }

    updateUserStatus() {
        this.cdr.detectChanges();
        this.isAuthenticated = this.authService.isAuthenticated();
        console.log(this.isAuthenticated)
        this.userData = this.authService.getUserData();
        console.log('userData ',this.userData.userName)
        this.userName = this.userData ? this.userData.userName : ''; // Ensure userData has a name property
        console.log('this.userName ',this.userName)
    }

    getDashboardRoute(): string {
        // Użyj zmiennej userData zamiast ponownego pobierania danych
        return this.userData && this.userData.role === 'admin' ? '/admin-dashboard' : '/dashboard';
    }

    // Call this method after user login or logout actions
    onUserAuthenticationChange() {
        this.updateUserStatus();
    }

    updateBasketCount() {
        this.basketSubscription = this.basketService.getBasketObservable().subscribe(basket => {
            this.basketCount = basket.length;
            this.cdr.detectChanges(); // Może być wymagane, aby zmusić Angular do detekcji zmian
        });
        
    }

    logout() {
        // Implement the logic to log out the user
        // This usually involves clearing authentication data and redirecting the user
        this.authService.logout(); // Assuming your AuthService has a logout method
        this.updateUserStatus();
        this.router.navigate(['/']); // Redirect to home page or login page
    }

    ngOnDestroy() {
        // Pamiętaj o wypisaniu się z subskrypcji, aby uniknąć wycieków pamięci
        this.authSubscription.unsubscribe();
        this.basketSubscription.unsubscribe();
    }
}
