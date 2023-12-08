import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsPerCommunityComponent } from './leads-per-community.component';

describe('LeadsPerCommunityComponent', () => {
  let component: LeadsPerCommunityComponent;
  let fixture: ComponentFixture<LeadsPerCommunityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadsPerCommunityComponent]
    });
    fixture = TestBed.createComponent(LeadsPerCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
