import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { HomeDemoOneComponent } from './components/pages/home-demo-one/home-demo-one.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './components/pages/terms-conditions-page/terms-conditions-page.component';
import { ProfileAuthenticationPageComponent } from './components/pages/profile-authentication-page/profile-authentication-page.component';
import { SignupPageComponent } from './components/pages/signup-page/signup-page.component';
import { ForgotPasswordPageComponent } from './components/pages/forgot-password-page/forgot-password-page.component';
import { PricingPageComponent } from './components/pages/pricing-page/pricing-page.component';
import { CourseDetailsPageComponent } from './components/pages/course-details-page/course-details-page.component';
import { CoursesGridPageComponent } from './components/pages/courses-grid-page/courses-grid-page.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SzkoleniaComponent } from './components/dashboard/courses/szkolenia.component';
import { CertyfikatyComponent } from './components/dashboard/certyfikaty/certyfikaty.component';
import { ActiveCoursesComponent } from './components/dashboard/active-courses/active-courses.component';
import { ZespolComponent } from './components/dashboard/zespol/zespol.component';
import { PakietyComponent } from './components/dashboard/pakiety/pakiety.component';
import { CompletedCoursesComponent } from './components/dashboard/completed-courses/completed-courses.component';
import { OchronaComponent } from './components/dashboard/ochrona-page/ochrona-page.component';
import { EditProfileComponent } from './components/dashboard/edit-profile/edit-profile.component';
import { AuthGuard } from './components/pages/core/guard/auth.guard';
import MyProfileComponent from './components/dashboard/my-profile/my-profile.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './components/dashboard/admin-courses/admin-courses.component';
import { AdminUsersComponent } from './components/dashboard/admin-users/admin-users.component';
import { CourseExamComponent } from './components/dashboard/course-exam/course-exam.component';
import { ExamComponent } from './components/dashboard/your-course/course-exam/course-exam/exam.component';
import { AdminEditExamComponent } from './components/dashboard/admin-edit-exam/admin-edit-exam/admin-edit-exam.component';
import { BasketPageComponent } from './components/pages/basket-page/basket-page.component';
import { SuccessPageComponent } from './components/pages/success-page/success-page.component';
import { AdminCompaniesComponent } from './components/dashboard/admin-companies/admin-companies/admin-companies.component';
import { AdminCertificatesComponent } from './components/dashboard/admin-certificates/admin-certificates.component';
import { AdminSettingsComponent } from './components/dashboard/admin-settings/admin-settings.component';
import { FailurePageComponent } from './components/pages/failure-page/failure-page.component';


const routes: Routes = [

    {path: '', component: HomeDemoOneComponent, data: { header: 'website' }},
    {path: 'about', component: AboutPageComponent, data: { header: 'website' }},
    {path: 'pricing', component: PricingPageComponent, data: { header: 'website' }},
    {path: 'courses-grid', component: CoursesGridPageComponent, data: { header: 'website' }},
    {
        path: 'course-details/:courseId',
        component: CourseDetailsPageComponent,
        data: { header: 'website' }
      },
    {path: 'koszyk', component: BasketPageComponent, data: { header: 'website' }},
    {path: 'success-page', component: SuccessPageComponent, data: { header: 'website'}},
    {path: 'failure-page', component: FailurePageComponent, data: { header: 'website'}},
    {path: 'privacy-policy', component: PrivacyPolicyPageComponent, data: { header: 'website' }},
    {path: 'terms-conditions', component: TermsConditionsPageComponent, data: { header: 'website' }},
    {path: 'profile-authentication', component: ProfileAuthenticationPageComponent, data: { header: 'website' }},
    {path: 'forgot-password', component: ForgotPasswordPageComponent, data: { header: 'website' }},
    {path: 'contact', component: ContactPageComponent, data: { header: 'website' }},
    {path: 'signup', component: SignupPageComponent, data: { header: 'website' }},
    {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [AuthGuard],
            data: { role: ['user','manager'] },
        children: [
            { path: 'szkolenia', component: SzkoleniaComponent },
            { path: 'exam', component: ExamComponent},
            { path: 'my-profile', component: MyProfileComponent },
            { path: 'edit-profile', component: EditProfileComponent },
            { path: 'certyfikaty', component: CertyfikatyComponent },
            { path: 'active-courses', component: ActiveCoursesComponent },
            
            // { path: 'active-courses', component: ActiveCoursesComponent },
            { 
                path: 'zespol', 
                component: ZespolComponent,
                canActivate: [AuthGuard],
                data: { role: ['admin', 'manager', 'superadmin'] }
            },
            { path: 'pakiety', component: PakietyComponent },
            { path: 'completed-courses', component: CompletedCoursesComponent},
            { path: 'ochrona', component: OchronaComponent},
            // { path: '', component: DashboardComponent },
            // { path: '**', component: DashboardComponent },
        ]
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        data: { role: ['admin', 'superadmin'] },
        children: [
            { path: 'my-profile', component: MyProfileComponent },
            { path: 'courses', component: AdminCoursesComponent },
            { path: 'users', component: AdminUsersComponent },
            { 
                path: 'create-exam/:courseId', 
                component: AdminEditExamComponent,
                canActivate: [AuthGuard],
                data: { role: ['admin', 'superadmin'] }
            },
            { 
                path: 'companies',
                component: AdminCompaniesComponent,
                canActivate: [AuthGuard],
                data: { role: ['admin', 'superadmin'] }
            },
            { 
                path: 'certificates',
                component: AdminCertificatesComponent,
                canActivate: [AuthGuard],
                data: { role: ['admin', 'superadmin'] }
            },
            { 
                path: 'settings',
                component: AdminSettingsComponent,
                canActivate: [AuthGuard],
                data: { role: ['admin', 'superadmin'] }
            }
            // { path: '', component: AdminDashboardComponent },
            // { path: '**', component: AdminDashboardComponent },
        ]
    },

    // Here add new pages component

    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }