import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadRoutingComponent } from './lead-routing.component';

describe('LeadRoutingComponent', () => {
  let component: LeadRoutingComponent;
  let fixture: ComponentFixture<LeadRoutingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadRoutingComponent]
    });
    fixture = TestBed.createComponent(LeadRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
