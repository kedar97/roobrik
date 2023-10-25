import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportsComponent } from './custom-reports.component';

describe('CustomReportsComponent', () => {
  let component: CustomReportsComponent;
  let fixture: ComponentFixture<CustomReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomReportsComponent]
    });
    fixture = TestBed.createComponent(CustomReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
