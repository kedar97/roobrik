import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subscription } from 'rxjs';
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

  breadcrumbParent: string ='';
  constructor(private router : Router, public postLoginService : PostLoginService, private dialogService: DialogService,){
    this.initRoutes();
    if(router.url.includes('leads-per-community') || router.url.includes('financial-data')){
      this.breadcrumbParent = 'Reports';
    }
    else if(router.url.includes('custom-reports')){
      this.breadcrumbParent = 'Client Dashboard'
    }
  }
  
  showClientDashboardOptions(event){
    this.showClientDashboardMenu = !this.showClientDashboardMenu;
    this.showReportsMenu = false;
    this.breadcrumbParent = event.target.innerText;
  }

  showReportsOptions(event){
    this.showReportsMenu = !this.showReportsMenu;
    this.showClientDashboardMenu = false;
    this.breadcrumbParent = event.target.innerText;
  }

  onClientHealthMetrics(event) {
    this.router.navigate(['/dashboard/leads-per-community']);
    this.showReportsMenu = !this.showReportsMenu;
  }

  onSaasRevenue(event) {
    this.router.navigate(['/dashboard/financial-data']);
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

  showProfileBtn(event: Event) {
    this.showProfileMenu = !this.showProfileMenu;
    event.stopPropagation();
  }

  onProfile(){
    this.router.navigate(['/dashboard/profile']);
    this.showProfileMenu = !this.showProfileMenu
  }

  onDataAndReports(){
    this.router.navigate(['/dashboard/custom-reports']);
    this.showClientDashboardMenu = !this.showClientDashboardMenu;
  }

  private initRoutes(): void {
    this.routesData = this.router.events.subscribe(() => {
        const route = this.router.url;
        this.items = route
            .substring(0, route.indexOf('?') !== -1 ? route.indexOf('?') : route.length)
            .split('/')
            .filter(Boolean)
            .map((segment) => {
              if(segment === 'dashboard'){
                segment = this.breadcrumbParent;
              }
                return {
                    text: segment.charAt(0).toUpperCase() + segment.slice(1),
                    title: segment,
                };
            });
    });
  }

  public ngOnDestroy(): void {
    this.routesData.unsubscribe();
  }
}
