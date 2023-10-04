import {
  Component,
  HostListener,
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SVGIcon } from '@progress/kendo-angular-icons';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  reports: boolean = false;
  infoBtn: boolean = false;
  profileBtn: boolean = false;

  constructor(private route:Router){}

  showReportOptions(event: Event) {
    this.reports = !this.reports;
    this.infoBtn = this.profileBtn = false;
    event.stopPropagation();
  }

  showInfoBtn(event: Event) {
    this.infoBtn = !this.infoBtn;
    this.reports = this.profileBtn = false;
    event.stopPropagation();
  }

  showProfileBtn(event: Event) {
    this.profileBtn = !this.profileBtn;
    this.reports = this.infoBtn = false;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.reports) {
      const popupElement = document.querySelector('.popup-reports');
      const buttonElement = document.querySelector('.link-reports');
      if (
        popupElement &&
        buttonElement &&
        !popupElement.contains(event.target as Node) &&
        !buttonElement.contains(event.target as Node)
      ) {
        this.reports = false;
      }
    }
    if (this.infoBtn) {
      const popupElement = document.querySelector('.popup-info');
      const buttonElement = document.querySelector('.info-btn');
      if (
        popupElement &&
        buttonElement &&
        !popupElement.contains(event.target as Node) &&
        !buttonElement.contains(event.target as Node)
      ) {
        this.infoBtn = false;
      }
    }
    if (this.profileBtn) {
      const popupElement = document.querySelector('.popup-profile');
      const buttonElement = document.querySelector('.action-btn');
      if (
        popupElement &&
        buttonElement &&
        !popupElement.contains(event.target as Node) &&
        !buttonElement.contains(event.target as Node)
      ) {
        this.profileBtn = false;
      }
    }
  }
  onProfile(){
    this.route.navigate(['profile']);
  }
  onSelectAccount(){
   
    this.route.navigate(['select']);
    
        
  }
  onStandardReports(){
    this.route.navigate(['standardReports']);
  }
  
}
