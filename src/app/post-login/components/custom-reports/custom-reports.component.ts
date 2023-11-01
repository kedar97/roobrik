import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GridApi } from 'ag-grid-community';
import {
  CustomReportRowData,
  PaginationOption,
} from 'src/app/post-login/post-login.modal';
import { SideBarDef } from 'ag-grid-community/dist/lib/main';
import {
  NotificationRef,
  NotificationService,
} from '@progress/kendo-angular-notification';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { PostLoginService } from '../../post-login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-reports',
  templateUrl: './custom-reports.component.html',
  styleUrls: ['./custom-reports.component.scss'],
})
export class CustomReportsComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  hideNotificationSubscription: Subscription;

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
        error: (error: any) => {
        },
      });
  }

  ngOnInit(): void {}

  notificationMessages = [
    {
      type: 'success',
      message: 'The Report(s) Deactivated Successfully.',
      text: 'Check your computer’s downloads folder',
    },

    {
      type: 'warning',
      message: 'The Warning.',
    },
  ];

  notificationRef: NotificationRef;

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

  selectedValue = 10;
  defaultColumnState: any;
  defaultFiltersState: any;
  gridData: any;

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
  public gridApi!: GridApi;
  gridColumnApi: any;
  selectedRowCount: number = 0;

  public defaultColDef = {
    sortable: true,
    filter: true,
    flex: 1,
  };

  gridOptions: GridOptions = {
    suppressDragLeaveHidesColumns: true,
    pagination: true,
    paginationPageSize: 10,
  };

  columnDef: ColDef[] = [
    {
      field: 'reportName',
      headerName: 'Report Name',
      pinned: 'left',
      lockPinned: true,
      lockPosition: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: 'agMultiColumnFilter',
      minWidth: 300,
      enableRowGroup: true,
      enableValue: true,
      cellRenderer: function (params: any) {
        if (params.data.description) {
          return `<div class="d-flex flex-column custom-gap-4 padding-top">
                    <div class="d-flex align-items-center custom-gap-4">
                      <p class="report-name">${params.value}</p>
                      <p class="bedge d-flex align-items-center justify-content-center">NEW</p>
                    </div>
                    <p class="small-text">${params.data.description}</p>
                  </div>`;
        } else {
          return params.value;
        }
      },
    },

    {
      minWidth: 200,
      field: 'reportPeriod',
      headerName: 'Report Period',
      lockPinned: true,
      filter: 'agMultiColumnFilter',
      enableRowGroup: true,
      enableValue: true,
      valueGetter: (params) => {
        if (params.data) {
          const stareDate = new Date(params.data.reportPeriod.startDate);
          const startDay = stareDate.getDate();
          const statMonth = stareDate.getMonth() + 1;
          const startYear = stareDate.getFullYear();

          const endDate = new Date(params.data.reportPeriod.endDate);
          const endDay = endDate.getDate();
          const endMonth = endDate.getMonth() + 1;
          const endYear = endDate.getFullYear();

          return ` ${statMonth.toString().padStart(2, '0')}/${startDay
            .toString()
            .padStart(2, '0')}/${startYear} - ${endMonth
            .toString()
            .padStart(2, '0')}/${endDay
            .toString()
            .padStart(2, '0')}/${endYear}`;
        }

        return null;
      },

      cellClass: 'report-period',
      cellStyle: {
        color: '#2A2A2A',
        'font-family': 'Helvetica Neue',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'font-style': 'normal',
      },
    },

    {
      minWidth: 150,
      field: 'addedOn',
      headerName: 'Added On',
      lockPinned: true,

      cellClass: 'added-on',
      cellStyle: {
        color: '#2A2A2A',
        'font-family': 'Helvetica Neue',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'font-style': 'normal',
      },
      cellRenderer: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          return `${day.toString().padStart(2, '0')}/${month
            .toString()
            .padStart(2, '0')}/${year}`;
        }

        return null;
      },
    },
    {
      minWidth: 150,
      field: 'assessmentName',
      headerName: 'Assessment Name',
      lockPinned: true,
      hide: true,
      cellClass: 'assessment-name',
      cellStyle: {
        color: '#2A2A2A',
        'font-family': 'Helvetica Neue',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'font-style': 'normal',
      },
    },
    {
      minWidth: 150,
      field: 'fileType',
      headerName: 'File Type',
      lockPinned: true,
      hide: true,
      cellClass: 'file-type',
      cellStyle: {
        color: '#2A2A2A',
        'font-family': 'Helvetica Neue',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'font-style': 'normal',
      },
    },
    {
      minWidth: 150,
      field: 'createdBy',
      headerName: 'Created By',
      lockPinned: true,
      hide: true,
      cellClass: 'created-by',
      cellStyle: {
        color: '#2A2A2A',
        'font-family': 'Helvetica Neue',
        'font-size': '14px',
        'font-weight': '400',
        'line-height': '16px',
        'font-style': 'normal',
      },
    },
    {
      width: 140,
      field: 'actions',
      headerName: 'Actions',
      headerClass: 'hide-header-text',
      pinned: 'right',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      lockPinned: true,
      lockPosition: true,
      cellRenderer: function () {
        return `<div class="d-flex align-items-center gap-10">
                  <div class="preview-div action-container">
                    <button class="btn action-buttons"><img src="assets/images/preview-icon.svg"></button>
                    <p class="preview-tag tag-text">Preview</p>
                  </div>
                  <div class="download-div action-container">
                  <button class="btn action-buttons"><img src="assets/images/report-download-icon.svg"></button>
                  <p class="download-tag tag-text">Download</p>
                  </div>
                </div>`;
      },
    },
  ];

  rowData: CustomReportRowData[] = [
    {
      reportName: 'Franchise Name - Downsize - July 2023',
      reportPeriod: {
        startDate: new Date(2023, 3, 26),
        endDate: new Date(2023, 6, 17),
      },
      addedOn: new Date(2018, 6, 10),
    },

    {
      reportName: 'All locations -  Senior Living - July 2023',
      description:
        'This is a custom report description written by the person who uploads the report.',
      reportPeriod: {
        startDate: new Date(2023, 11, 12),
        endDate: new Date(2023, 11, 20),
      },
      addedOn: new Date(2023, 4, 14),
    },

    {
      reportName: 'All locations - Downsize - July 2023',
      description:
        'This is a custom report description written by the person who uploads the report.',
      reportPeriod: {
        startDate: new Date(2024, 1, 8),
        endDate: new Date(2024, 1, 10),
      },
      addedOn: new Date(2023, 1, 25),
    },

    {
      reportName: 'Franchise Name - July 2023',
      reportPeriod: {
        startDate: new Date(2024, 1, 19),
        endDate: new Date(2024, 1, 24),
      },
      addedOn: new Date(2023, 1, 23),
    },

    {
      reportName: 'Franchise Name - July 2023',
      reportPeriod: {
        startDate: new Date(2023, 3, 26),
        endDate: new Date(2023, 6, 13),
      },
      addedOn: new Date(2023, 7, 17),
    },

    {
      reportName: 'Franchise Name - July 2023',
      reportPeriod: {
        startDate: new Date(2023, 11, 12),
        endDate: new Date(2023, 11, 20),
      },
      addedOn: new Date(2023, 4, 14),
    },

    {
      reportName: 'Franchise Name - July 2023',
      reportPeriod: {
        startDate: new Date(2014, 1, 8),
        endDate: new Date(2014, 1, 10),
      },
      addedOn: new Date(2018, 6, 10),
    },

    {
      reportName: 'Franchise Name - July 2023',
      reportPeriod: {
        startDate: new Date(2023, 3, 26),
        endDate: new Date(2023, 6, 13),
      },
      addedOn: new Date(2018, 4, 14),
    },
  ];

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

  onSearch() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedNodes();
    this.selectedRowCount = selectedRows.length;
  }

  onItemsPerPageChange(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
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

  onClearSection() {
    this.gridApi.deselectAll();
  }

  ngOnDestroy(): void {
    this.hideNotificationSubscription.unsubscribe();
  }
}
