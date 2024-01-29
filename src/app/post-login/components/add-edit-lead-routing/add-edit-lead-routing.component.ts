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
import { PostLoginService } from '../../post-login.service';

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
  dataToEdit: any;
  userData: UserData = {
    email: '',
    firstName: '',
    lastName: '',
    listName: '',
    locations: [],
  };

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
      field: 'location',
      headerName: 'Location',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      floatingFilter: true,
      valueFormatter: valueFormatter,
      filter: 'agSetCol umnFilter',
      filterParams: {
        valueFormatter: valueFormatter,
      },
    },
  ];

  public locationList = [
    {
      location: 'Cedarhurst Villages',
    },
    {
      location: 'Brightview Bridgewater',
    },
    {
      location: 'Brightview Meadows',
    },
    {
      location: 'Brightview Lakeview Terrace',
    },
    {
      location: 'Belmont Village East',
    },
    {
      location: 'Belmont Village West',
    },
    {
      location: 'Highpoint at Cape Coral',
    },
    {
      location: 'Highpoint at Fort Mill',
    },
    {
      location: 'Highpoint at Stonecreek',
    },
  ];

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public style: any = {
    width: '752px',
    height: '398px',
  };

  constructor(
    private activateRouter: ActivatedRoute,
    private postLoginService: PostLoginService
  ) {
    this.activateRouter.url.subscribe((urlSegments) => {
      if (urlSegments[0].path === 'edit-lead-routing') {
        this.isEditMode = true;

        this.userData.email = this.postLoginService.leadRoutingUserData.email;
        this.userData.firstName =
          this.postLoginService.leadRoutingUserData.firstName;
        this.userData.lastName =
          this.postLoginService.leadRoutingUserData.lastName;
        this.userData.listName = 'List-item 1, List-item 2';

        if (this.postLoginService.leadRoutingUserData.locations === 'All') {
          this.locationList.forEach((location: any) => {
            this.userData.locations.push({ name: location.location });
          });
        } else {
          const locationList =
            this.postLoginService.leadRoutingUserData.locations.split(',');
          locationList.forEach((location: any) => {
            this.userData.locations.push({ name: location });
          });
        }

        const locationList =
          this.postLoginService.leadRoutingUserData.locations === 'All'
            ? this.locationList
            : this.postLoginService.leadRoutingUserData.locations.split(',');

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

  onGridReady(params: GridReadyEvent) {
    const self = this;
    this.gridApi = params.api;
    const nodeList = this.gridApi.getRenderedNodes();
    nodeList.forEach((node: any) => {
      self.userData.locations.forEach((location) => {
        if (node.data.location.trim() === location.name.trim()) {
          node.setSelected(true);
        }
      });
    });
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
