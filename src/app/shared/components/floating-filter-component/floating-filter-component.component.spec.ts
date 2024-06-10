import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingFilterComponent } from './floating-filter-component.component';

describe('FloatingFilterComponentComponent', () => {
  let component: FloatingFilterComponent;
  let fixture: ComponentFixture<FloatingFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FloatingFilterComponent]
    });
    fixture = TestBed.createComponent(FloatingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
