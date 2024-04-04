import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailurePageComponent } from './failure-page.component';

describe('FailurePageComponent', () => {
  let component: FailurePageComponent;
  let fixture: ComponentFixture<FailurePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailurePageComponent]
    });
    fixture = TestBed.createComponent(FailurePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
