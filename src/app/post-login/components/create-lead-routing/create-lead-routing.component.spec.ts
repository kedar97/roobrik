import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeadRoutingComponent } from './create-lead-routing.component';

describe('CreateLeadRoutingComponent', () => {
  let component: CreateLeadRoutingComponent;
  let fixture: ComponentFixture<CreateLeadRoutingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateLeadRoutingComponent]
    });
    fixture = TestBed.createComponent(CreateLeadRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
