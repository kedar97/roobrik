import {
  Component,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showReportMenu: boolean = false;
  showInfoPopup: boolean = false;
  showProfileMenu: boolean = false;

  constructor() {}

  showReportOptions(event: Event) {
    this.showReportMenu = !this.showReportMenu;
    this.showInfoPopup = this.showProfileMenu = false;
    event.stopPropagation();
  }

  showInfoBtn(event: Event) {
    this.showInfoPopup = !this.showInfoPopup;
    this.showReportMenu = this.showProfileMenu = false;
    event.stopPropagation();
  }

  showProfileBtn(event: Event) {
    this.showProfileMenu = !this.showProfileMenu;
    this.showInfoPopup = this.showReportMenu = false;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const popupElement = document.querySelector('.popup');
      const buttonElement = document.querySelector('.popup-btn');
      if (
        popupElement &&
        buttonElement &&
        !popupElement.contains(event.target as Node) &&
        !buttonElement.contains(event.target as Node)
      ) {
        this.showReportMenu = this.showProfileMenu = this.showInfoPopup = false;


      }
  }
}
