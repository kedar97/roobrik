import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourVideoPopUpComponent } from './tour-video-pop-up.component';

describe('TourVideoPopUpComponent', () => {
  let component: TourVideoPopUpComponent;
  let fixture: ComponentFixture<TourVideoPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourVideoPopUpComponent]
    });
    fixture = TestBed.createComponent(TourVideoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
