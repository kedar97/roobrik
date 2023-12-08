 import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  PaginationOption,
  LeadRoutingRowData,
} from 'src/app/post-login/post-login.modal';
import { ColDef, GridApi, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import {
  NotificationRef,
  NotificationService,
} from '@progress/kendo-angular-notification';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { PostLoginService } from '../../post-login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lead-routing',
  templateUrl: './lead-routing.component.html',
  styleUrls: ['./lead-routing.component.scss'],
})
export class LeadRoutingComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    private ele: ElementRef,
    private notificationService: NotificationService,
    private postLoginService: PostLoginService
  ) {
    this.hideNotificationSubscription =
      this.postLoginService.hideNotifiation.subscribe({
        next: (value: boolean) => {
          if (value == true && this.container) {
            this.container.element.nativeElement.innerHTML = '';
          }
        },
        error: (error: any) => {},
      });
  }
  ngOnDestroy(): void {
    this.hideNotificationSubscription.unsubscribe();
  }

  @ViewChild('container', { read: ViewContainerRef })
  public container: ViewContainerRef;

  notificationMessages = [
    {
      type: 'success',
      message: 'The User(s) Deactivated Successfully.',
      text: 'Check your computer’s downloads folder',
    },

    {
      type: 'warning',
      message: 'The Warning.',
    },

    {
      type: 'error',
      message: 'ERROR.',
      text: 'Check your computer’s downloads folder',
    },

    {
      type: 'info',
      message: 'Information.',
      text: 'Check your computer’s downloads folder',
    },
  ];

  notificationRef: NotificationRef;
  hideNotificationSubscription: Subscription;

  public show(): void {
    this.container.element.nativeElement.innerHTML = '';
    this.notificationMessages.forEach((message: any) => {
      this.notificationRef = this.notificationService.show({
        content: NotificationsComponent,
        type: { style: message.type, icon: false },
        closable: true,
        position: { horizontal: 'center', vertical: 'top' },
        appendTo: this.container,
      });

      const notificationInstance = this.notificationRef.content?.instance;
      switch (message.type) {
        case 'success':
          notificationInstance.header = message.message;
          notificationInstance.title = message.text;
          notificationInstance.tags =
            "<i class='fa fa-check-circle' aria-hidden='true'></i>";
          break;

        case 'warning':
          notificationInstance.header = message.message;
          notificationInstance.tags =
            "<i class='fa fa-exclamation-triangle' aria-hidden='true'></i>";
          break;

        case 'error':
          notificationInstance.header = message.message;
          notificationInstance.title = message.text;
          notificationInstance.tags =
            "<i class='fa fa-exclamation-circle' aria-hidden='true'></i>";
          break;

        case 'info':
          notificationInstance.header = message.message;
          notificationInstance.title = message.text;
          notificationInstance.tags =
            "<i class='fa fa-info-circle' aria-hidden='true'></i>";
      }
    });
  }

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
      headerName: 'Email Address',
      field: 'email',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 250,
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
      minWidth: 60,
      maxWidth: 200,
    },

    {
      field: 'locations',
      lockPinned: true,
      cellClass: 'locationField',
      filter: 'agMultiColumnFilter',
      headerName: 'Locations',
      minWidth: 90,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      headerClass: 'action-header',
      pinned: 'right',
      cellClass: 'actionsField',
      lockPinned: true,
      lockPosition: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: this.customCellRenderer.bind(this),
    },
    {
      field: 'status',
      headerName: 'Status',
      filter: 'agMultiColumnFilter',
      lockPinned: true,
      hide: true,
      minWidth: 70,
    },
    {
      field: 'lastModifiedDate',
      headerName: 'Last Modified Date',
      filter: 'agMultiColumnFilter',
      lockPinned: true,
      hide: true,
      minWidth: 70,
    },
    {
      field: 'lastModifiedBy',
      headerName: 'Last Modified By',
      filter: 'agMultiColumnFilter',
      lockPinned: true,
      hide: true,
      minWidth: 80,
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    resizable: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeight: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
  };

  rowData: LeadRoutingRowData[] = [
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'Cedarhurst Villages',
      status: 'Active',
      lastModifiedDate: '10/10/2020',
      lastModifiedBy: 'aaaaaaaa bbbbb',
    },
    {
      email: 'ajessica@accountemail.com',
      firstName: 'Tim',
      lastName: 'Boeshaar',
      locations: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      locations:
        'Brightview Bridgewater, Brightview Meadows, Brightview Lakeview Terrace',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'Belmont Village East, Belmont Village West',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      locations:
        'Highpoint at Cape Coral, Highpoint at Fort Mill, Highpoint at Stonecreek',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      locations: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      locations: 'All',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'Cedarhurst Villages',
      status: 'Active',
    },

    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'Cedarhurst Villages',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Tim',
      lastName: 'Boeshaar',
      locations: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      locations:
        'Brightview Bridgewater, Brightview Meadows, Brightview Lakeview Terrace',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'Belmont Village East, Belmont Village West',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      locations:
        'Highpoint at Cape Coral, Highpoint at Fort Mill, Highpoint at Stonecreek',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Dawn',
      lastName: 'Guttman',
      locations: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Mitchell',
      lastName: ' Hatten',
      locations: 'All',
      status: 'Active',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'All',
      status: 'Inactive',
    },
    {
      email: 'jessica@accountemail.com',
      firstName: 'Kellie',
      lastName: 'Rash',
      locations: 'Cedarhurst Villages',
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

  headerHeightSetter() {
    var padding = 27;
    var height = this.headerHeightGetter() + padding;
    this.gridApi.setHeaderHeight(height);
    this.gridApi.resetRowHeights();
    const resetButton = document.querySelector<HTMLElement>('.resetButton');
    const toolPanelWrapper = document.querySelector<HTMLElement>(
      '.ag-tool-panel-wrapper'
    );
    if (resetButton && toolPanelWrapper) {
      resetButton.style.height = toolPanelWrapper.style.marginTop =
        height.toString() + 'px';
    }
  }

  headerHeightGetter() {
    var columnHeaderTexts = document.querySelectorAll('.ag-header-cell-text');
    var columnHeaderTextsArray: any = [];
    columnHeaderTexts.forEach((node) => columnHeaderTextsArray.push(node));
    var clientHeights = columnHeaderTextsArray.map(
      (headerText: any) => headerText.clientHeight
    );
    var tallestHeaderTextHeight = Math.max(...clientHeights);
    return tallestHeaderTextHeight;
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
    this.gridColumnApi.applyColumnState({
      state: this.defaultColumnState,
      applyOrder: true,
    });
  }

  onClearSection() {
    this.gridApi.deselectAll();
  }

  customCellRenderer(params: any): HTMLElement {
    const self = this;
    const cellElement = document.createElement('div');
    cellElement.classList.add('d-flex', 'custom-gap');

    const editDiv = document.createElement('div');
    editDiv.classList.add('d-flex', 'flex-column', 'edit-div');

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-status', 'edit-button');
    editButton.innerHTML = '<img src="assets/images/edit-icon.svg">';
    editButton.addEventListener('click', function () {
      self.postLoginService.editLeadRoutingData(params.data);
    });

    const editLabel = document.createElement('p');
    editLabel.classList.add('edit-label');
    editLabel.textContent = 'Edit';

    editDiv.appendChild(editButton);
    editDiv.appendChild(editLabel);

    const statusDiv = document.createElement('div');
    statusDiv.classList.add('d-flex', 'flex-column', 'status-div');

    const statusButton = document.createElement('button');
    statusButton.classList.add('btn', 'btn-status');
    statusButton.innerHTML = '<img src="assets/images/activate-icon.svg">';

    const userStatus = document.createElement('p');
    userStatus.classList.add('user-status');
    userStatus.textContent =
      params.data.status === 'Active' ? 'Deactivate' : 'Activate';

    statusDiv.appendChild(statusButton);
    statusDiv.appendChild(userStatus);

    cellElement.appendChild(editDiv);
    cellElement.appendChild(statusDiv);
    return cellElement;
  }
}
