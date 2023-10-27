import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ColDef, GridReadyEvent } from 'ag-grid-community/dist/lib/main';
import { SideBarDef } from 'ag-grid-community/dist/lib/main';
import {
  ColumnApi,
  GetDataPath,
  GridApi,
  ICellRendererComp,
  ICellRendererParams,
} from '@ag-grid-community/all-modules';
import {
  PaginationOption,
  StandardReportsRowData,
} from '../../post-login.modal';

@Component({
  selector: 'app-standard-reports',
  templateUrl: './standard-reports.component.html',
  styleUrls: ['./standard-reports.component.scss'],
})
export class StandardReportsComponent implements OnInit {
  private gridApi!: GridApi | any;
  private gridColumnApi!: ColumnApi | any;
  public groupDefaultExpanded = -1;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  selectedRowCount: number = 0;
  paginationPageSize = 10;
  griddata: any;
  resetFilters: boolean = false;
  resetColumns: boolean = false;
  defaultColumnState: any;
  defaultFiltersState: any;
  ngOnInit(): void {}

  public columnDefs: ColDef[] = [
    {
      field: 'reportFrequency',
      minWidth: 200,
      headerName: 'Report Frequency',
      cellClass: 'reportCell',
      enableRowGroup: true,
      enableValue: true,
      lockPinned: true,
      filter: 'agMultiColumnFilter',
    },
    {
      field: 'addedOn',
      headerName: 'Added on',
      minWidth: 200,
      enableRowGroup: true,
      enableValue: true,
      cellClass: 'addedOnCell',
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
      filterParams: {
        valueFormatter: (params: any) => {
          if (params.value) {
            const date = new Date(params.value);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day.toString().padStart(2, '0')}/${month
              .toString()
              .padStart(2, '0')}/${year}`;
          }
          return '';
        },
        filter: 'agMultiColumnFilter',
      },
      headerClass: 'centeredHeader',
      lockPinned: true,
    },
    {
      field: 'assessmentName',
      headerName: 'Assessment name',
      minWidth: 200,
      enableRowGroup: true,
      enableValue: true,
      headerClass: 'centeredHeader',
      hide: true,
    },
    {
      field: 'reportPeriod',
      headerName: 'Report Period',
      minWidth: 200,
      enableRowGroup: true,
      enableValue: true,
      headerClass: 'centeredHeader',
      lockPinned: true,
      hide: true,
    },
    {
      field: 'fileType',
      headerName: 'File Type',
      minWidth: 200,
      enableRowGroup: true,
      enableValue: true,
      headerClass: 'centeredHeader',
      lockPinned: true,
      hide: true,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      minWidth: 200,
      enableRowGroup: true,
      // enableValue: true,
      headerClass: 'centeredHeader',
      lockPinned: true,
      hide: true,
    },
    {
      field: 'actions',
      enableRowGroup: true,
      enableValue: true,
      headerName: 'Actions',
      headerClass: 'hide-header-text',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: function (params: any) {
        return `
        <div class="iconsColumnDiv d-flex">
          <div class=" previewIcon d-flex flex-column" >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none" style="margin-top:29px;align-self:center" >
              <g clip-path="url(#clip0_146_8879)" class="m-1">
                <path d="M16.8238 15.7682L15.3608 14.28C15.669 13.8012 15.858 13.2532 15.9116 12.6834C15.9651 12.1136 15.8815 11.5392 15.6681 11.0096C15.4547 10.48 15.1178 10.0113 14.6865 9.64391C14.2553 9.27652 13.7426 9.02149 13.1928 8.90087L13.1699 8.89662V6.01441C13.17 5.84728 13.1126 5.68539 13.0077 5.55682L13.0084 5.55824V5.5547C12.9952 5.53845 12.9813 5.52285 12.9666 5.50795L12.9611 5.50157L12.9423 5.48245L7.76417 0.212449C7.74976 0.197785 7.73467 0.183839 7.71894 0.170657L7.70084 0.157907C7.68954 0.148542 7.67793 0.139565 7.66604 0.13099L7.64864 0.11824L7.61106 0.0941569L7.59505 0.0856569C7.57928 0.0762125 7.56188 0.0674763 7.54285 0.0594486L7.52058 0.0502402L7.48509 0.0374902L7.46003 0.0296986L7.41966 0.0190736L7.40018 0.0148236C7.3804 0.0106654 7.36042 0.00759148 7.34032 0.00561523H1.11267C0.925903 0.00635692 0.74696 0.0820513 0.614698 0.216263C0.482435 0.350474 0.407532 0.532368 0.40625 0.722449L0.40625 15.1562C0.406432 15.347 0.480828 15.5301 0.613189 15.6653C0.74555 15.8006 0.925118 15.877 1.11267 15.8779H12.4641C13.1428 15.8792 13.8065 15.6753 14.3711 15.2922L14.3586 15.2999L15.8216 16.7889C15.9564 16.9137 16.1334 16.981 16.3157 16.9765C16.498 16.9721 16.6716 16.8964 16.8005 16.7652C16.9294 16.6339 17.0036 16.4571 17.0078 16.2716C17.012 16.0861 16.9459 15.906 16.8231 15.7689L16.8238 15.7696V15.7682ZM14.5096 12.349C14.5097 12.6228 14.4567 12.894 14.3538 13.1469C14.2509 13.3999 14.1001 13.6298 13.9099 13.8234C13.7197 14.0171 13.4938 14.1707 13.2453 14.2755C12.9968 14.3803 12.7304 14.4343 12.4614 14.4344C12.1923 14.4344 11.9259 14.3805 11.6774 14.2758C11.4288 14.1711 11.2029 14.0175 11.0127 13.8239C10.8224 13.6304 10.6715 13.4005 10.5685 13.1476C10.4655 12.8947 10.4124 12.6235 10.4124 12.3497C10.4122 11.7968 10.6279 11.2664 11.0119 10.8752C11.396 10.4841 11.917 10.2642 12.4603 10.2641C13.0036 10.2639 13.5248 10.4834 13.9091 10.8742C14.2934 11.2651 14.5094 11.7961 14.5096 12.349ZM7.97019 2.46353L10.7492 5.29262H7.97019V2.46353ZM1.82466 1.44353H6.55247V6.01441C6.55247 6.4132 6.86984 6.7362 7.26168 6.7362H11.7528V8.89662C10.1674 9.24157 8.99537 10.6554 8.99537 12.3483C8.99537 13.1339 9.24731 13.8592 9.67395 14.445L9.66699 14.4358H1.82397L1.82466 1.44353Z" fill="#2F2F2F"/>
              </g>
              <defs>
                <clipPath id="clip0_146_8879">
                  <rect width="16.7036" height="17" fill="white" transform="translate(0.40625)"/>
                </clipPath>
              </defs>
            </svg>
            <span class="preview">Preview</span>
          </div>
          <div class="previewIcon d-flex flex-column">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" style="margin-top:25px;align-self:center">
              <path d="M12.2204 16L7.30755 11L8.68314 9.55L11.2378 12.15V4H13.2029V12.15L15.7576 9.55L17.1332 11L12.2204 16ZM6.32499 20C5.78458 20 5.32179 19.804 4.93663 19.412C4.55146 19.02 4.35921 18.5493 4.35986 18V15H6.32499V18H18.1158V15H20.0809V18C20.0809 18.55 19.8883 19.021 19.5031 19.413C19.118 19.805 18.6555 20.0007 18.1158 20H6.32499Z" fill="#2F2F2F"/>
            </svg>
            <span class="download">Download</span>
            </div></div>
          `;
      },
      pinned: 'right',
      lockPinned: true,
    },
  ];

  public autoGroupColumnDef: ColDef = {
    headerCheckboxSelection: true,
    headerName: 'Report Name',
    filter: 'agGroupColumnFilter',
    cellStyle: { 'padding-left': '45px' },
    pinned: 'left',
    lockPinned: true,
    cellRendererParams: {
      suppressCount: true,
      checkbox: true,
      innerRenderer: badgeCellRenderer(),
    },
  };

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

  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

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

  public rowData: StandardReportsRowData[] | null = [
    {
      reportName: ['Franchise Name - Downsize - July 2023'],
      reportFrequency: 'Monthly',
      addedOn: new Date(2018, 6, 10),
    },
    {
      reportName: ['All locations - Senior Living - July 2023'],
      reportFrequency: 'Monthly',
      addedOn: new Date(2023, 4, 14),
    },

    {
      reportName: [
        'All locations - Senior Living - July 2023',
        'Brightview Westlake - Senior Living - July 2023',
      ],
      reportFrequency: 'Monthly',
      addedOn: new Date(2023, 4, 14),
    },
    {
      reportName: [
        'All locations - Senior Living - July 2023',
        'Brightview  Eastlake  - Senior Living - July 2023',
      ],
      reportFrequency: 'Monthly',
      addedOn: new Date(2023, 4, 14),
    },
    {
      reportName: ['All locations - Downsize - July 2023'],
      reportFrequency: 'Weekly',
      addedOn: new Date(2023, 1, 25),
    },
    {
      reportName: [
        'All locations - Downsize - July 2023',
        'Brightview - Eastlake - Downsize - July 2023',
      ],
      reportFrequency: 'Weekly',
      addedOn: new Date(2023, 1, 25),
    },

    {
      reportName: ['Franchise Name - July 2023'],
      reportFrequency: 'Annually',
      addedOn: new Date(2023, 1, 23),
    },

    {
      reportName: ['Franchise Name - July 2022'],
      reportFrequency: 'Weekly',
      addedOn: new Date(2018, 7, 17),
    },
  ];

  constructor(private renderer: Renderer2, private ele: ElementRef) {}

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

  public getDataPath: GetDataPath = (data: any) => {
    return data.reportName;
  };

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('search-box') as any).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.griddata = params;
    0;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();
  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedNodes();
    this.selectedRowCount = selectedRows.length;
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
}

// For Badge on nested rows
function badgeCellRenderer() {
  class badgeCellRenderer implements ICellRendererComp {
    eGui: any;
    init(params: ICellRendererParams) {
      var tempDiv = document.createElement('div');

      var childrenCount = params.node.allChildrenCount;

      if (childrenCount) {
        tempDiv.innerHTML = `<span><span class="rowData">${params.value}</span><span class="newBadge">New</span><h6 class="subText">A monthly look at Roobrik product performance metrics and response distribution.</h6 ></span>`;
      } else {
        if (params.node.parent?.rowIndex) {
          tempDiv.innerHTML = `<span class="childData">${params.value}<span>`;
        } else {
          tempDiv.innerHTML = `<span class="rowData">${params.value}<span>`;
        }
      }

      this.eGui = tempDiv.firstChild;
    }
    getGui() {
      return this.eGui;
    }
    refresh() {
      return false;
    }
  }
  return badgeCellRenderer;
}
