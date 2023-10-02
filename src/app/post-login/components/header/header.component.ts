import { ChangeDetectorRef, Component } from '@angular/core';
import { SVGIcon } from '@progress/kendo-angular-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  constructor(){}

  displayReports1: boolean = false;
  displayReports3: boolean = false;
  displayReports2: boolean = false;

  showReportOptions1() {
    this.displayReports1 = !this.displayReports1;
    this.displayReports2 = this.displayReports3 = false;
  }

  showReportOptions2() {
    this.displayReports2 = !this.displayReports2;
    this.displayReports1 = this.displayReports3 = false;
  }
  
  showReportOptions3() {
    this.displayReports3 = !this.displayReports3;
    this.displayReports1 = this.displayReports2 = false;
  }
}
