import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSaasRevenueComponent } from './edit-saas-revenue.component';

describe('EditSaasRevenueComponent', () => {
  let component: EditSaasRevenueComponent;
  let fixture: ComponentFixture<EditSaasRevenueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSaasRevenueComponent]
    });
    fixture = TestBed.createComponent(EditSaasRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
