import { CUSTOM_ELEMENTS_SCHEMA , NgModule } from '@angular/core';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxStripeModule } from 'ngx-stripe';
import { NgChartsModule } from 'ng2-charts';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeDemoOneComponent } from './components/pages/home-demo-one/home-demo-one.component';


import { NavbarComponent } from './components/common/navbar/navbar.component';
import { DashboardNavbarComponent } from './components/common/dasnboard-navbar/dasnboard-navbar.component';
import { DashboardSidebarComponent } from './components/common/dasnboard-sidebar/dasnboard-sidebar.component';


import { FooterComponent } from './components/common/footer/footer.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';

import { PartnerComponent } from './components/common/partner/partner.component';
import { FeaturesComponent } from './components/common/features/features.component';



import { AboutComponent } from './components/common/about/about.component';
import { InstructorsComponent } from './components/common/instructors/instructors.component';
import { FeaturedComponent } from './components/common/featured/featured.component';
import { CategoriesComponent } from './components/common/categories/categories.component';
import { CoursesComponent } from './components/common/courses/courses.component';
import { FeaturedCoursesComponent } from './components/common/featured-courses/featured-courses.component';
import { HomeoneBannerComponent } from './components/pages/home-demo-one/homeone-banner/homeone-banner.component';
import { TopRatedCoursesComponent } from './components/common/top-rated-courses/top-rated-courses.component';
import { FunfactsComponent } from './components/common/funfacts/funfacts.component';
import { FeaturedBoxesComponent } from './components/common/featured-boxes/featured-boxes.component';



import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';

import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './components/pages/terms-conditions-page/terms-conditions-page.component';
import { ProfileAuthenticationPageComponent } from './components/pages/profile-authentication-page/profile-authentication-page.component';

import { ForgotPasswordPageComponent } from './components/pages/forgot-password-page/forgot-password-page.component';



import { PricingPageComponent } from './components/pages/pricing-page/pricing-page.component';

import { CoursesGridPageComponent } from './components/pages/courses-grid-page/courses-grid-page.component';

import { CourseDetailsPageComponent } from './components/pages/course-details-page/course-details-page.component';
import { BasketPageComponent} from './components/pages/basket-page/basket-page.component';

import { SignupPageComponent } from './components/pages/signup-page/signup-page.component';


import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SzkoleniaComponent } from './components/dashboard/courses/szkolenia.component';

import { CertyfikatyComponent } from './components/dashboard/certyfikaty/certyfikaty.component';
import { ActiveCoursesComponent } from './components/dashboard/active-courses/active-courses.component';
import { PakietyComponent } from './components/dashboard/pakiety/pakiety.component';
import { CompletedCoursesComponent } from './components/dashboard/completed-courses/completed-courses.component';
import { OchronaComponent } from './components/dashboard/ochrona-page/ochrona-page.component';
import { ZespolComponent } from './components/dashboard/zespol/zespol.component';
import { EditProfileComponent } from './components/dashboard/edit-profile/edit-profile.component';



// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import MyProfileComponent from './components/dashboard/my-profile/my-profile.component';
import { DurationPipe } from './components/pages/core/pipes/duration.pipe';
import { YourCourseComponent } from './components/dashboard/your-course/your-course.component';
import { CourseExamComponent } from './components/dashboard/course-exam/course-exam.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { AdminDashboardSidebarComponent } from './components/common/admin-dashboard-sidebar/admin-dashboard-sidebar.component';
import { AdminCoursesComponent } from './components/dashboard/admin-courses/admin-courses.component';
import { AdminUsersComponent } from './components/dashboard/admin-users/admin-users.component';
import { ExamComponent } from './components/dashboard/your-course/course-exam/course-exam/exam.component';
import { SafeUrlPipe } from './components/dashboard/_pipes/safe-url.pipe';
import { AdminEditExamComponent } from './components/dashboard/admin-edit-exam/admin-edit-exam/admin-edit-exam.component';
import { SuccessPageComponent } from './components/pages/success-page/success-page.component';
import { AdminCompaniesComponent } from './components/dashboard/admin-companies/admin-companies/admin-companies.component';
import { AdminCertificatesComponent } from './components/dashboard/admin-certificates/admin-certificates.component';
import { AdminSettingsComponent } from './components/dashboard/admin-settings/admin-settings.component';
import { ToastService } from './components/dashboard/_core/_services/toast.service';
import { ToastComponent } from './components/dashboard/_shared/toast/toast.component';
import { ToasterComponent } from './components/dashboard/_shared/toaster/toaster.component';
import { FailurePageComponent } from './components/pages/failure-page/failure-page.component';
import { AdminDashboardNavbarComponent } from './components/dashboard/admin-dashboard-navbar/admin-dashboard-navbar.component';
// register Swiper custom elements
register();
@NgModule({
    declarations: [
        AppComponent,
        HomeDemoOneComponent,
        NavbarComponent,
        DashboardNavbarComponent,
        DashboardSidebarComponent,
        FooterComponent,
        NotFoundComponent,
       
        PartnerComponent,
        FeaturesComponent,
       
    
        InstructorsComponent,
        AboutComponent,
        FeaturedComponent,
        CategoriesComponent,
        CoursesComponent,
        FeaturedCoursesComponent,
        HomeoneBannerComponent,
        TopRatedCoursesComponent,
        FunfactsComponent,
        FeaturedBoxesComponent,
       
        ContactPageComponent,
        AboutPageComponent,
       
        PrivacyPolicyPageComponent,
        TermsConditionsPageComponent,
        ProfileAuthenticationPageComponent,
        
        ForgotPasswordPageComponent,
        
        PricingPageComponent,
       
        CoursesGridPageComponent,
        DashboardComponent,
        SzkoleniaComponent, 
        CertyfikatyComponent,
        MyProfileComponent,
        ActiveCoursesComponent,
        PakietyComponent,
        CompletedCoursesComponent,
        OchronaComponent,
        ZespolComponent,
        EditProfileComponent,
        CourseDetailsPageComponent,
        SignupPageComponent,
        DurationPipe,
        YourCourseComponent,
        CourseExamComponent,
        ExamComponent,
        AdminDashboardComponent,
        AdminDashboardSidebarComponent,
        AdminCoursesComponent,
        AdminUsersComponent,
        SafeUrlPipe,
        BasketPageComponent,
        AdminEditExamComponent,
        SuccessPageComponent,
        AdminCompaniesComponent,
        AdminCertificatesComponent,
        AdminSettingsComponent,
        ToastComponent,
        ToasterComponent,
        FailurePageComponent,
        AdminDashboardNavbarComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        NgChartsModule.forRoot(),
        NgxStripeModule.forRoot('pk_live_51Oo539BHXkVoVGsNeOGPscdKh0UeArSlK82DtI5LMjEDslwugbbY4bVYHHXzi3KQHcz7SE6vTBgq4tyy4kULCn4P00XOuEE1bN'),
        NgxSkeletonLoaderModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgxScrollTopModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }