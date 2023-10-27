import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
  PaginationOption,
  LeadRoutingRowData,
} from 'src/app/post-login/post-login.modal';
import { ColDef, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-lead-routing',
  templateUrl: './lead-routing.component.html',
  styleUrls: ['./lead-routing.component.scss'],
})
export class LeadRoutingComponent {
  showToast = false;
  defaultColumnState: any;
  defaultFiltersState: any;
  resetFilters = false;
  resetColumns = false;
  gridData: any;
  selectedValue = 10;
  paginationOptions: PaginationOption[] = [
    {
      title: '100 per page',
      value: 100,
    },
    {
      title: '75 per page',
      value: 75,
    },
    {
      title: '50 per page',
      value: 50,
    },
    {
      title: '25 per page',
      value: 25,
    },
    {
      title: '10 per page',
      value: 10,
    },
  ];

  columnDef: ColDef[] = [
    {
      field: 'email',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      // minWidth: 300,
      cellStyle: {
        width: 'fit-content',
        overflow: 'visible',
        'text-overflow': 'none',
      },
      cellClass: 'emailField',
      pinned: 'left',
      lockPinned: true,
      lockPosition: true,
      filter: 'agMultiColumnFilter',
      cellRenderer: (params: any) => {
        return `<a href="#" class="email-text">${params.value}</a>`;
      },
    },
    {
      field: 'fullname',
      headerName: 'Name',
      filter: 'agMultiColumnFilter',
      lockPinned: true,
      cellClass: 'nameField',
      maxWidth: 200,
    },

    {
      field: 'location',
      lockPinned: true,
      cellClass: 'locationField',
      filter: 'agMultiColumnFilter',
      cellStyle: {
        'text-overflow': 'ellipsis',
        'white-space': 'no-wrap',
        overflow: 'hidden',
        display: 'block',
        'min-width': '400',
        'padding-top': '25px',
      },
    },

    {
      // width:140,
      field: 'actions',
      headerName: 'Actions',
      headerClass: 'action-header',
      pinned: 'right',
      cellClass: 'actionsField',
      lockPinned: true,
      lockPosition: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: function (params: any) {
        return `<div class="d-flex custom-gap">
                  <button class="btn"><img src="assets/images/edit-icon.svg"></button>
                  <div class="d-flex flex-column status-div">
                    <button class="btn btn-status"><img src="assets/images/activate-icon.svg"></button>
                    <p class="user-status">${params.data.status}</p>
                  </div>
                </div>`;
      },
    },
  ];

  public defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
  };

  rowData: LeadRoutingRowData[] = [
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'Cedarhurst Villages Brightview Bridgewater',
      status: 'Active',
    },
    {
      email: 'ajessica@accountemail.com',
      firstName: 'Tim',
      lastName: 'Boeshaar',
      location: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      location:
        'Brightview Bridgewater, Brightview Meadows, Brightview Lakeview Terrace,Brightview Bridgewater, Brightview Meadows, Brightview Lakeview Terrace,Brightview Bridgewater, Brightview Meadows, Brightview Lakeview Terrace,',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'Belmont Village East, Belmont Village West',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      location:
        'Highpoint at Cape Coral, Highpoint at Fort Mill, Highpoint at Stonecreek',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      location: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      location: 'All',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'Cedarhurst Villages',
      status: 'Active',
    },

    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'Cedarhurst Villages',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Tim',
      lastName: 'Boeshaar',
      location: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      location:
        'Brightview Bridgewater, Brightview Meadows, Brightview Lakeview Terrace',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'Belmont Village East, Belmont Village West',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      location:
        'Highpoint at Cape Coral, Highpoint at Fort Mill, Highpoint at Stonecreek',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      location: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      location: 'All',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      location: 'Cedarhurst Villages',
      status: 'Active',
    },
  ];

  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public gridApi!: GridApi | any;
  gridColumnApi: any;
  selectedRowCount: number = 0;

  gridOptions: GridOptions = {
    suppressDragLeaveHidesColumns: true,
    pagination: true,
    paginationPageSize: 10,
  };

  constructor(private renderer: Renderer2, private ele: ElementRef) {}

  ngOnInit() {
    this.rowData.forEach((data: any) => {
      data.fullname = data.firstName + ' ' + data.lastName;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();
    this.gridApi.addEventListener(
      'columnVisible',
      this.handleColumnVisibility.bind(this)
    );
  }

  handleColumnVisibility(event: any) {
    const allColumns = this.gridData.columnApi.getAllDisplayedColumns();
    if (allColumns.length == 1) {
      let column = allColumns.find(
        (col: any) => col.userProvidedColDef.field === 'actions'
      );
      if (column) this.gridData.columnApi.setColumnVisible(column, false);
      else this.gridData.columnApi.setColumnVisible('actions', true);
    } else if (allColumns.length >= 3) {
      this.gridData.columnApi.setColumnVisible('actions', true);
    }
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedNodes();
    this.selectedRowCount = selectedRows.length;
  }

  onItemsPerPageChange(newPageSize: any) {
    console.log('newPageSize', newPageSize);
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  onSearch() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onToolPanelVisibleChanged(params: any) {
    if (params.visible) {
      if (params.key === 'filters') {
        const sideBar = this.ele.nativeElement.querySelector('.ag-side-bar');
        const existingButton = sideBar.querySelector('.resetButton');
        if (existingButton) {
          this.renderer.removeChild(sideBar, existingButton);
        }
        if (sideBar) {
          const button = this.renderer.createElement('button');
          this.renderer.addClass(button, 'resetButton');
          this.renderer.listen(button, 'click', () => this.onResetFilter());
          button.innerHTML = 'Reset Filters';

          this.renderer.appendChild(sideBar, button);
        }
      } else if (params.key === 'columns') {
        const sidebar = this.ele.nativeElement.querySelector('.ag-side-bar');
        const resetButton = sidebar.querySelector('.resetButton');
        if (resetButton) {
          this.renderer.removeChild(sidebar, resetButton);
        }
        const button = this.renderer.createElement('button');
        this.renderer.addClass(button, 'resetButton');
        this.renderer.listen(button, 'click', () => this.onResetColumns());
        button.innerHTML = 'Reset Columns';

        const toolPanelWrapper =
          this.ele.nativeElement.querySelector('.ag-side-bar');
        if (toolPanelWrapper) {
          this.renderer.appendChild(toolPanelWrapper, button);
        }
      }
    } else {
      const sideBar = this.ele.nativeElement.querySelector('.ag-side-bar');
      const resetButton = sideBar.querySelector('.resetButton');
      if (resetButton) {
        this.renderer.removeChild(sideBar, resetButton);
      }
    }
  }

  onResetFilter() {
    this.gridApi.setFilterModel(this.defaultFiltersState);
  }

  onResetColumns() {
    console.log(this.defaultColumnState, 'reset');
    this.gridColumnApi.applyColumnState({
      state: this.defaultColumnState,
      applyOrder: true,
    });
  }

  onClearSection() {
    this.gridApi.deselectAll();
  }

  public show(): void {
    this.showToast = true;
  }

  closeToast() {
    this.showToast = false;
  }
}
