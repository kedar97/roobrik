import { Component, Input } from '@angular/core';
import { PostLoginService } from '../../post-login.service';

@Component({
  selector: 'app-announcement-banner',
  templateUrl: './announcement-banner.component.html',
  styleUrls: ['./announcement-banner.component.scss']
})
export class AnnouncementBannerComponent {

  constructor(private postLoginService : PostLoginService){}

  onCloseBanner(){
    this.postLoginService.bannerSubject.next(false);
  }
}
