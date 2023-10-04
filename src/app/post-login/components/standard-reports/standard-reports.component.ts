import { Component, ViewChildren, QueryList, ViewEncapsulation, HostListener } from '@angular/core';
import { DataStateChangeEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { GroupResult, process, State } from '@progress/kendo-data-query';
import { ProductModule } from '../standardReports/product/product.module';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgCheckboxComponent } from './ag-checkbox/ag-checkbox.component';
import {AllCommunityModules} from '@ag-grid-community/all-modules';
@Component({
  selector: 'app-standard-reports',
  templateUrl: './standard-reports.component.html',
  
  styleUrls: ['./standard-reports.component.scss'],
  
})
export class StandardReportsComponent {
 


  
  }


