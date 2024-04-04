import { Component, HostListener, ElementRef, Renderer2, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../pages/core/service/auth.service';
import { UserService } from '../../pages/core/service/user.service';
import { AvatarService } from '../../pages/core/service/avatar.service';
import { EventTypes } from '../../dashboard/_core/_models/event-types';
import { ToastService } from '../../dashboard/_core/_services/toast.service';

interface UserData {
    userName: string;
    role: 'user' | 'manager' | 'admin';
    // ... inne właściwości ...
  }

@Component({
    selector: 'app-dasnboard-navbar',
    templateUrl: './dasnboard-navbar.component.html',
    styleUrls: ['./dasnboard-navbar.component.scss']
})

export class DashboardNavbarComponent implements OnInit { 
    isAuthenticated: boolean = false;
    userName: string = '';
    userRole: string = '';
    userAvatar: string | null = null;
    private roleMappings: {[key: string]: string} = {
        user: 'Użytkownik',
        manager: 'Menadżer',
        admin: 'Administrator'
      };

    // Navbar Sticky
    isSticky: boolean = false;
    
    // Set default header type
    headerType: string = 'website';  // Default to website header
    constructor(private avatarService: AvatarService, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef ,private renderer: Renderer2, private elementRef: ElementRef, private toastService: ToastService) {
        // Subscribe to router events to detect route changes
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            const routeData = this.router.routerState.root.firstChild?.snapshot.data;
            this.headerType = routeData && 'header' in routeData ? routeData['header'] : 'website';
        });
    }

    ngOnInit(): void {
        this.cdr.detectChanges();
        const userData: UserData = this.authService.getUserData();
    this.userName = userData.userName;
    this.userRole = this.roleMappings[userData.role] || 'Nieznana Rola';
        
       

        this.avatarService.getAvatarUrl().subscribe(avatarUrl => {
            console.log('avatarUrl', avatarUrl);
            if (avatarUrl && this.isValidUrl(avatarUrl)) {
              this.userAvatar = avatarUrl;
            } else {
              this.userAvatar = null;
              console.error('Avatar URL jest nieprawidłowy lub null');
            }
            this.cdr.detectChanges(); // Wymuszanie detekcji zmian
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


    toggleMenu() {
        const navigation = document.querySelector(".navigation");
        const main = document.querySelector(".main");
        const topbar = document.querySelector(".topbar");
    
        if (navigation && main && topbar) {
          navigation.classList.toggle("active");
          main.classList.toggle("active");
          topbar.classList.toggle("active");
        }
      }

      isValidUrl(url: string): boolean {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      }
    // getUserName(): string {
    //     const userData = this.authService.getUserData();
    //     return userData ? userData.userName : ''; // Adjust this if the property name is different
    // }

    // getUserRole(): string {
    //     const userData = this.authService.getUserData();
       
    //     return userData ? userData.role : ''; // Adjust this if the property name is different
    // }

    updateUserStatus() {
        this.cdr.detectChanges();
        this.isAuthenticated = this.authService.isAuthenticated();
        console.log(this.isAuthenticated)
        const userData = this.authService.getUserData();
        console.log('userData ',userData.userName)
        this.userName = userData ? userData.userName : ''; // Ensure userData has a name property
        console.log('this.userName ',this.userName)
    }

    // Call this method after user login or logout actions
    onUserAuthenticationChange() {
        this.updateUserStatus();
    }

    logout() {
        // Implement the logic to log out the user
        // This usually involves clearing authentication data and redirecting the user
        this.authService.logout(); // Assuming your AuthService has a logout method
        this.updateUserStatus();
        this.router.navigate(['/']);
        this.cdr.detectChanges(); // Redirect to home page or login page
    }
}
