import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgCheckboxComponent } from './ag-checkbox.component';

describe('AgCheckboxComponent', () => {
  let component: AgCheckboxComponent;
  let fixture: ComponentFixture<AgCheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgCheckboxComponent]
    });
    fixture = TestBed.createComponent(AgCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
