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
  
  columnDefs : ColDef[]=[
    { headerName:'Repoert Name',headerCheckboxSelection: true, checkboxSelection: true,field:'name' ,width:600}, // Checkbox column
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' },
  ];

  rowData = [
    {name:'df',make: 'Toyota', model: 'Celica', price: 35000 },
    {name:'df', make: 'Ford', model: 'Mondeo', price: 32000 },
    // Add more data as needed
  ];

  
  }


