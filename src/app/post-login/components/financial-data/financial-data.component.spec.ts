import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDataComponent } from './financial-data.component';

describe('FinancialDataComponent', () => {
  let component: FinancialDataComponent;
  let fixture: ComponentFixture<FinancialDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialDataComponent]
    });
    fixture = TestBed.createComponent(FinancialDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
