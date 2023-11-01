import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import { UserData } from '../../post-login.modal';

@Component({
  selector: 'app-add-edit-lead-routing',
  templateUrl: './add-edit-lead-routing.component.html',
  styleUrls: ['./add-edit-lead-routing.component.scss'],
})
export class AddEditLeadRoutingComponent implements OnInit {
  gridApi!: GridApi | any;
  checked: boolean = false;
  selectedRowCount: number = 0;
  isEditMode: boolean = false;
  userData: UserData = { email: '', firstName: '', lastName: '', listName: '' };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public style: any = {
    width: '752px',
    height: '398px',
  };

  constructor(private activateRouter: ActivatedRoute) {
    this.activateRouter.url.subscribe((urlSegments) => {
      
      if (urlSegments[0].path === 'edit-lead-routing') {
        this.isEditMode = true;
        
        this.userData.email = 'rushitvora@gmail.com';
        this.userData.firstName = 'Rushit';
        this.userData.lastName = 'Vora';
        this.userData.listName = 'List-item 1, List-item 2';
  
        this.form.patchValue({
          email: this.userData.email,
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          listName: this.userData.listName,
        });
      }
    });
  }

  ngOnInit(): void {}

  public form = new FormGroup({
    switch: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl('', Validators.email),
    listName: new FormControl(),
  });
  public secoundform = new FormGroup({
    email: new FormControl('', Validators.email),
    listName: new FormControl(),
  });

  public columnDefs: ColDef[] = [
    {
      width: 752,
      field: 'locations',
      headerName: 'Locations',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      floatingFilter: true,
      valueFormatter: valueFormatter,
      filter: 'agSetColumnFilter',
      filterParams: {
        valueFormatter: valueFormatter,
      },
    },
  ];

  public rowData = [
    {
      locations: 'Location name 1',
    },
    {
      locations: 'Location name 2',
    },
    {
      locations: 'Location name 3',
    },
    {
      locations: 'Location name 4',
    },
    {
      locations: 'Location name 5',
    },
    {
      locations: 'Location name 6',
    },
    {
      locations: 'Location name 7',
    },
    {
      locations: 'Location name 8',
    },
    {
      locations: 'Location name 9',
    },
    {
      locations: 'Location name 10',
    },
    {
      locations: 'Location name 11',
    },
    {
      locations: 'Location name 12',
    },
    {
      locations: 'Location name 13',
    },
    {
      locations: 'Location name 14',
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedNodes();
    const rowsLength = this.gridApi.rowModel.rowsToDisplay.length;
    this.selectedRowCount = selectedRows.length;

    if (this.selectedRowCount === rowsLength) {
      this.style.height = '48px';
      this.checked = !this.checked;
    } else if (this.selectedRowCount < 1) {
      this.style.height = '398px';
      this.checked = !this.checked;
    } else {
      this.style.height = '398px';
    }
  }

  onCheked() {
    this.checked = !this.checked;
    if (this.checked) {
      this.gridApi.selectAll();
    } else {
      this.gridApi.deselectAll();
    }
  }
}
function valueFormatter(params: ValueFormatterParams) {
  return params.value;
}
