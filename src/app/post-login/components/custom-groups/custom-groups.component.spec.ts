import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGroupsComponent } from './custom-groups.component';

describe('CustomGroupsComponent', () => {
  let component: CustomGroupsComponent;
  let fixture: ComponentFixture<CustomGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomGroupsComponent]
    });
    fixture = TestBed.createComponent(CustomGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
