import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSidebarComponent } from './admin-dashboard-sidebar.component';

describe('AdminDashboardSidebarComponent', () => {
  let component: AdminDashboardSidebarComponent;
  let fixture: ComponentFixture<AdminDashboardSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDashboardSidebarComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
