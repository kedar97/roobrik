import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditLeadRoutingComponent } from './add-edit-lead-routing.component';

describe('AddEditLeadRoutingComponent', () => {
  let component: AddEditLeadRoutingComponent;
  let fixture: ComponentFixture<AddEditLeadRoutingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditLeadRoutingComponent]
    });
    fixture = TestBed.createComponent(AddEditLeadRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
