import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardNavbarComponent } from './admin-dashboard-navbar.component';

describe('AdminDashboardNavbarComponent', () => {
  let component: AdminDashboardNavbarComponent;
  let fixture: ComponentFixture<AdminDashboardNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardNavbarComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
