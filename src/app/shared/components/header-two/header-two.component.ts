import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/post-login/components/dialog/dialog.component';
import { PostLoginService } from 'src/app/post-login/post-login.service';

@Component({
  selector: 'app-header-two',
  templateUrl: './header-two.component.html',
  styleUrls: ['./header-two.component.scss']
})
export class HeaderTwoComponent {
  public items = []
  private routesData: Subscription;

  showClientDashboardMenu : boolean = false;
  showReportsMenu : boolean = false;
  showProfileMenu: boolean = false;
  allItems: any;
  destroy$ = new Subject<void>();


  constructor(private router : Router, public postLoginService : PostLoginService, private dialogService: DialogService,){
    this.initRoutes();

    postLoginService.breadCrumbItems.pipe(takeUntil(this.destroy$)).subscribe(breadCrumbItems =>{
      this.items = breadCrumbItems;
    })
  }

  showClientDashboardOptions(event){
    this.showClientDashboardMenu = !this.showClientDashboardMenu;
    this.showReportsMenu = false;
  }

  showReportsOptions(event){
    this.showReportsMenu = !this.showReportsMenu;
    this.showClientDashboardMenu = false;
  }

  onClientHealthMetrics(event) {
    this.router.navigate(['/reports/client-health-metrics']);
    this.showReportsMenu = !this.showReportsMenu;
  }

  onSaasRevenue(event) {
    this.router.navigate(['/reports/saas-revenue']);
    this.showReportsMenu = !this.showReportsMenu;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const popupDashboardElement = document.querySelector('.popup-client-dashboard');
    const popupReportElement = document.querySelector('.popup-reports');
    const buttonDashboardElement = document.querySelector('.dashboard-popup-btn');
    const buttonReportElement = document.querySelector('.report-popup-btn');
    if (
     ( popupDashboardElement &&
      buttonDashboardElement &&
      !popupDashboardElement.contains(event.target as Node) &&
      !buttonDashboardElement.contains(event.target as Node)) ||
      ( popupReportElement &&
        buttonReportElement &&
        !popupReportElement.contains(event.target as Node) &&
        !buttonReportElement.contains(event.target as Node))
    ) {
      this.showClientDashboardMenu = this.showReportsMenu = false;
    }
  }

  onSelectAccount() {
    this.showProfileMenu = !this.showProfileMenu;
    this.dialogService.open({
      content: DialogComponent,
      cssClass:'switch-account-dialog'
    });
  }

  onSignOut(){
    localStorage.setItem('homePopupShow','true');
    this.router.navigate(['/']);
  }

  onProfile(){
    this.router.navigate(['/dashboard/profile']);
    this.showProfileMenu = !this.showProfileMenu
  }

  onDashboardAnnouncement(){
    this.router.navigate(['/client-dashbaord/announcement-management']);
    this.showClientDashboardMenu = !this.showClientDashboardMenu;
  }

  private initRoutes(): void {
    this.routesData = this.router.events.subscribe(() => {
      const route = this.router.url;
      this.allItems = route
        .substring(0, route.indexOf('?') !== -1 ? route.indexOf('?') : route.length)
        .split('/')
        .filter(Boolean)
        .map((segment) => {
          let words = segment.split('-');
          let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
          let newStr = capitalizedWords.join(' ');
          return {
            text: unescape(newStr),
            title: segment,
          };
        });
        this.items = this.allItems.slice(-2);
      });
    }
    
    public onItemClick(item: BreadCrumbItem): void {
    this.allItems.forEach(item =>{
      let words = item.text.split(' ');
      let lowercaseWords = words.map(word => word.toLowerCase());
      let newStr = lowercaseWords.join('-');
      item.text = newStr;
    })
    const selectedItemIndex = this.allItems.findIndex((i) => i.text === item.text);
    const url = this.allItems
      .slice(0, selectedItemIndex + 1)
      .map((i) => i.text.toLowerCase());
    this.router.navigate(url);
  }

  public ngOnDestroy(): void {
    this.routesData.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
