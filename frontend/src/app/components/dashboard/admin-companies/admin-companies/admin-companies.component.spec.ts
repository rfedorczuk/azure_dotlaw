import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompaniesComponent } from './admin-companies.component';

describe('AdminCompaniesComponent', () => {
  let component: AdminCompaniesComponent;
  let fixture: ComponentFixture<AdminCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCompaniesComponent]
    });
    fixture = TestBed.createComponent(AdminCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
