import { Component, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../pages/core/service/auth.service';

@Component({
  selector: 'app-dasnboard-sidebar',
  templateUrl: './dasnboard-sidebar.component.html',
  styleUrls: ['./dasnboard-sidebar.component.scss']
})
export class DashboardSidebarComponent implements OnInit{
  canAccessTeam: boolean = false;

  navCollapsed: boolean = false;
  navCollapsedMob = false;
  windowWidth: number = window.innerWidth; // Initialize with the current window width
  isSticky: boolean = false;
  headerType: string = 'website';

  constructor(private router: Router, private authService: AuthService, private renderer: Renderer2, private elementRef: ElementRef) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const routeData = this.router.routerState.root.firstChild?.snapshot.data;
      this.headerType = routeData && 'header' in routeData ? routeData['header'] : 'website';
    });
  }

  ngOnInit(): void {
    this.canAccessTeam = this.authService.hasRole('manager') || 
                       this.authService.hasRole('admin') || 
                       this.authService.hasRole('superadmin');
  }
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isSticky = scrollPosition >= 50;
  }

  // Other methods remain unchanged...

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
  handleMenuItemClick() {
    this.removeActiveClass();
  }

  removeActiveClass() {
    const isSmallScreen = window.innerWidth < 768;

    if (isSmallScreen) {
    const dashboardSidebar = this.elementRef.nativeElement.querySelector('.dashboard-sidebar');
    this.renderer.removeClass(dashboardSidebar, 'active');
    }
  }

}
