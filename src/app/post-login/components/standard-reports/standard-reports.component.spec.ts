import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardReportsComponent } from './standard-reports.component';

describe('StandardReportsComponent', () => {
  let component: StandardReportsComponent;
  let fixture: ComponentFixture<StandardReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandardReportsComponent]
    });
    fixture = TestBed.createComponent(StandardReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
