import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostLoginService } from './post-login.service';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrls: ['./post-login.component.scss'],
})
export class PostLoginComponent {
  bannerDisplay : boolean = false;

  constructor(private router: Router,private postLoginService :PostLoginService) {
    postLoginService.bannerSubject.subscribe( res =>{
      this.bannerDisplay = res;
    })
  }

  hideFooter(): boolean {
    if (this.router.url.includes('leads-per-community') || this.router.url.includes('client-health-metrics')) {
      return true;
    }
    return false;
  }

  hideAdmin2Header(): boolean{
    if(this.router.url.includes('client-health-metrics') || this.router.url.includes('saas-revenue') || this.router.url.includes('edit-saas-revenue') || this.router.url.includes('announcement-management') || this.router.url.includes('custom-groups') || this.router.url.includes('chat-configuration')){
      return true;
    }
    else{
      return false;
    }
  }

}
