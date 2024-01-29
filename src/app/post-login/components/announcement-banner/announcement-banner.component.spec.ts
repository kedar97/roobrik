import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementBannerComponent } from './announcement-banner.component';

describe('AnnouncementBannerComponent', () => {
  let component: AnnouncementBannerComponent;
  let fixture: ComponentFixture<AnnouncementBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnouncementBannerComponent]
    });
    fixture = TestBed.createComponent(AnnouncementBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
