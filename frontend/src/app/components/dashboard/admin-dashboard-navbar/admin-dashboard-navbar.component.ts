import {
  Component,
  HostListener,
  ElementRef,
  Renderer2,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthService } from "../../pages/core/service/auth.service";
import { UserService } from "../../pages/core/service/user.service";
import { AvatarService } from "../../pages/core/service/avatar.service";
import { EventTypes } from "../../dashboard/_core/_models/event-types";
import { ToastService } from "../../dashboard/_core/_services/toast.service";

interface UserData {
  userName: string;
  role: "user" | "manager" | "admin";
  // ... inne właściwości ...
}

@Component({
  selector: "app-admin-dashboard-navbar",
  templateUrl: "./admin-dashboard-navbar.component.html",
  styleUrls: ["./admin-dashboard-navbar.component.scss"],
})
export class AdminDashboardNavbarComponent {
  isAuthenticated: boolean = false;
  userName: string = "";
  userRole: string = "";
  userAvatar: string | null = null;
  private roleMappings: { [key: string]: string } = {
    user: "Użytkownik",
    manager: "Menadżer",
    admin: "Administrator",
  };

  // Navbar Sticky
  isSticky: boolean = false;

  // Set default header type
  headerType: string = "website";
  constructor(
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toastService: ToastService
  ) {

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const routeData =
          this.router.routerState.root.firstChild?.snapshot.data;
        this.headerType =
          routeData && "header" in routeData ? routeData["header"] : "website";
      });
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
    const userData: UserData = this.authService.getUserData();
    console.log("userDejta ", JSON.stringify(userData));
    this.userName = userData.userName;
    this.userRole = this.roleMappings[userData.role] || "Nieznana Rola";

    this.avatarService.getAvatarUrl().subscribe((avatarUrl) => {
      console.log("avatarUrl", avatarUrl);
      if (avatarUrl && this.isValidUrl(avatarUrl)) {
        this.userAvatar = avatarUrl;
      } else {
        this.userAvatar = null;
        console.error("Avatar URL jest nieprawidłowy lub null");
      }
      this.cdr.detectChanges();
    });
  }

  @HostListener("window:scroll", ["$event"])
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
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
    const navbar =
      this.elementRef.nativeElement.querySelector(".navbar-expand-lg");
    this.renderer.removeClass(navbar, "active");
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

  updateUserStatus() {
    this.cdr.detectChanges();
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log(this.isAuthenticated);
    const userData = this.authService.getUserData();
    console.log("userData ", userData.userName);
    this.userName = userData ? userData.userName : ""; 
    console.log("this.userName ", this.userName);
  }

  onUserAuthenticationChange() {
    this.updateUserStatus();
  }

  logout() {
    this.authService.logout();
    this.updateUserStatus();
    this.router.navigate(["/"]);
    this.cdr.detectChanges();
  }
}
