import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DialogComponent } from 'src/app/post-login/components/dialog/dialog.component';
import { BehaviorSubject } from 'rxjs';
import { PostLoginService } from 'src/app/post-login/post-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  showReportMenu: boolean = false;
  showInfoPopup: boolean = false;
  showProfileMenu: boolean = false;
  isSmallDesktopScreen: boolean = false;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private postLoginService: PostLoginService
  ) {}

  ngOnInit(): void {
    this.isSmallDesktopScreen = window.innerWidth <= 1366;
  }

  showReportOptions(event: Event) {
    this.showReportMenu = !this.showReportMenu;
    this.postLoginService.hideNotifiation.next(this.showReportMenu);
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
      this.postLoginService.hideNotifiation.next(false);
    }
  }

  onProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  onSelectAccount() {
    this.showProfileMenu = !this.showProfileMenu;
    this.dialogService.open({
      content: DialogComponent,
    });
  }

  onStandardReport() {
    this.router.navigate(['/dashboard/standard-reports']);
    this.showReportMenu = !this.showReportMenu;
  }

  onCustomReport() {
    this.router.navigate(['/dashboard/custom-reports']);
    this.showReportMenu = !this.showReportMenu;
  }
}
