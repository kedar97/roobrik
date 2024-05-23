import { Component, ElementRef, Renderer2} from '@angular/core';
import { ColDef, GetServerSideGroupKey, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, IServerSideDatasource, IsServerSideGroup, RowModelType, SideBarDef} from 'ag-grid-community';
import { PaginationOption } from '../../post-login.modal';
import { PostLoginService } from '../../post-login.service';
import { HttpClient } from '@angular/common/http';
import * as alasql from 'alasql';
import { NavigationExtras, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.scss']
})
export class FinancialDataComponent {
  saasRevenueUrl = "assets/saas-revenue-data.json";
  pinnedTopRowData = [];
  addColumnPopUp : boolean = false;
  yearToAdd : number;
  statusColIndex : number;
  summaryRowName = 'Saas Revenue Summary';
  constructor(private postLoginService : PostLoginService, private renderer: Renderer2,private ele: ElementRef, private http:HttpClient,private router:Router){}

  selectedValue = 100;
  cacheBlockSize = 100;
  expandedRows: Set<string> = new Set();
  paginationOptions: PaginationOption[] = [
    {
      title: '10 per page',
      value: 10,
    },

    {
      title: '25 per page',
      value: 25,
    },

    {
      title: '50 per page',
      value: 50,
    },

    {
      title: '100 per page',
      value: 100,
    },

    {
      title: '500 per page',
      value: 500,
    },
    {
      title: '1000 per page',
      value: 1000,
    },
    {
      title: '5000 per page',
      value: 5000,
    },

    {
      title: 'ALL',
      value: 'all',
    },
  ];

  rowModelType: RowModelType = 'serverSide';
  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  rowSelection: 'single' | 'multiple' = 'multiple';
  totalRows: number;
  rowIndex: number;
  selectedNodes = [];
  isExpanded: boolean = false;

  public form = new FormGroup({
    clientName : new FormControl('',Validators.required),
    invoicingEntity : new FormControl(),
    legalEntity : new FormControl(),
    franchiseCount : new FormControl()
  });

  customCurrencyFormatter(params: ICellRendererParams): string {
    let value = params.value;
    if(value != null || value != undefined){
      value = +value;
      return '$' + value?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return value;
  }
  
  columnDef : ColDef[] | any = [
    {
      field:'invoicing_entity',
      headerName:'Invoicing entity',
      width:120,
      hide:true,
      sortable: true,
    },
    {
      field:'legal_entity',
      headerName:'Legal entity',
      width:110,
      hide:true,
      sortable: true,
    },
    {
      field:'',
      headerName:'2021 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2021', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, valueFormatter: this.customCurrencyFormatter
        },
        { field: 'revenue2021.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2021.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
      ]
    },
    {
      field:'',
      headerName:'2022 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2022', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, valueFormatter: this.customCurrencyFormatter
        },
        { field: 'revenue2022.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2022.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
      ]
    },
    {
      field:'',
      headerName:'2023 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2023', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name', valueFormatter: this.customCurrencyFormatter
        },
        { field: 'revenue2023.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',
        valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2023.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
      ]
    },
    {
      field:'',
      headerName:'2024 total revenue',
      marryChildren: true,
      openByDefault:true,
      children: [
        { field: 'totalRevenue2024', headerName :'Total', columnGroupShow :null, minWidth: 70,filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',valueFormatter: this.customCurrencyFormatter
        },
        { field: 'revenue2024.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2024.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
      ]
    },    
    {
      field:'',
      headerName:'2025 total revenue',
      marryChildren: true,
      children: [
        { field: 'totalRevenue2025', headerName :'Total', columnGroupShow :null, minWidth: 70,filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, valueFormatter: this.customCurrencyFormatter
        },
        { field: 'revenue2025.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
        { field: 'revenue2025.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter },
      ]
    },    
    {
      field:'owner',
      headerName:'Account owner',
      sortable: true,
    }
  ]

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  };

  public autoGroupColumnDef: ColDef = {
    field: 'client_frenchiseName',
    headerName: 'Client/franchise name',
    headerCheckboxSelection:true,
    pinned: 'left',
    lockPinned: true,
    sortable: true,
    width: 300,
    cellStyle: {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      display: 'block',
      'padding-top': '4px',
    },
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        if(params.node.level == 0){
          let element;

          if(params.data.status === 'Active'){
            element =`<div class='parent-link parent-link-color' >${params.value}</div>`;
          }
          else{
            element = `<div class='parent-link'>${params.value}</div>`;
          }
          return element;
        }
        else{
          return `${params.value}`
        }
      },
    },
    onCellClicked: this.onCellClicked.bind(this)
  };

  onCellClicked(event: any): void {
    const self = this;
    const element = event.event.target as HTMLElement;
    if (element.classList.contains('parent-link') && event.value != 'Saas Revenue Summary') {
      const linkData = [event.data];
      const client_frenchiseName = linkData[0].client_frenchiseName;
      const navigationExtras: NavigationExtras = {
        state: {
          linkData: linkData
        }
      };
      self.router.navigate(['reports/saas-revenue',client_frenchiseName],navigationExtras)
    }
  }

  rowData = [];
  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.children;
  };
  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.client_frenchiseName;
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

  gridOptions: GridOptions = {
    enableRangeSelection: true,
    getRowId:(data) => {
      return data.data.clientId;
    },
    statusBar: {
      statusPanels: [
        {
          statusPanel: 'agAggregationComponent',
          statusPanelParams: {
            aggFuncs: ['avg', 'count', 'min', 'max', 'sum'],
          },
        },
      ],
    },
    onRowGroupOpened: this.onRowExpanded.bind(this),
  };

  onRowExpanded(event: any) {
    if (event.expanded) {
      this.expandedRows.add(event.node.key);
      setTimeout(() => {
        this.totalRows = this.gridApi.getModel().getRowCount();
      }, 700);
    } else {
      this.expandedRows.delete(event.node.key);
      this.totalRows = this.gridApi.getModel().getRowCount() ;
      this.rowIndex = event.rowIndex;
    }
  }

  ngOnInit(){}

  ngAfterViewInit() {
    const nextButtons = document.querySelector(
      '.ag-paging-button .ag-icon-next'
    );
    nextButtons.addEventListener(
      'click',
      this.onPaginationButtonClicked.bind(this)
    );
  }

  onPaginationChanged(event) {
    this.rowIndex = null;
  }

  getRowStyle(params: any): any {
    if (params.node.rowIndex === 0) {
      return { background: 'rgba(102, 163, 212, 0.3)' };
    }
    if (params.node.level > 0) {
      if (params.data && params.data.status === 'Active') {
        return { color: '#2F2F2F' }; 
      } else if(params.data && params.data.status === 'Inactive') {
          return { color: '#c2c2c2' }; 
      } 
    }
    if (params.data && params.data.status === 'Active') { 
      return { color: '#2F2F2F' }; 
    } else if(params.data && params.data.status === 'Inactive') {
        return { color: '#a7b8cc' }; 
    } 
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.postLoginService.getTableData(this.saasRevenueUrl).subscribe(data=>{
      this.pinnedTopRowData = [{
        clientId: data[data.length-1].clientId + data[data.length-1].children.length + 1,
        client_frenchiseName : "Saas Revenue Summary",
        children : [
          {  client_frenchiseName: "ARR", children: null},
          {  client_frenchiseName: "MRR", children: null}
        ]
      }]

      data = this.getSortedData(data);

      data.forEach(item => {
        item.children = this.getSortedData(item.children);
      })

      data.forEach(parent => {
        parent.children.forEach(child => {
          for (const year of ['2025', '2024', '2023', '2022', '2021']) {
            for (const month of Object.keys(child[`revenue${year}`])) {
              parent[`revenue${year}`] = parent[`revenue${year}`] || {};
              parent[`revenue${year}`][month] = (parent[`revenue${year}`][month] || 0) + (child[`revenue${year}`][month] || 0);
            }
            parent[`totalRevenue${year}`] = (parent[`totalRevenue${year}`] || 0) + (child[`totalRevenue${year}`] || 0);
          }
        });
      });

      const revenueYears = Object.keys(data[0]).filter(key => key.startsWith('revenue')).map(key => key.slice(7));
      
      //  SET REVENUE PROPERTY OF TOP PINNED ROW
      data.forEach(item => {
        revenueYears.forEach(year => {
          this.pinnedTopRowData[0].children.forEach((child,index) => {
            child.clientId = this.pinnedTopRowData[0].clientId + index + 1;
            if(child.client_frenchiseName === 'MRR'){
              child[`totalRevenue${year}`] = 0;
            }
            if (!child[`revenue${year}`]) {
              child[`revenue${year}`] = {};
            }
            for (const month of Object.keys(item[`revenue${year}`])) {
              if (!child[`revenue${year}`][month]) {
                child[`revenue${year}`][month] = 0;
              }
            }
          })
        })
      })
      
      // SET VALUE FOR MRR REVENUE MONTH
      data.forEach(item =>{
        this.pinnedTopRowData[0].children.forEach(child => {
          revenueYears.forEach(year =>{
            for (const month of Object.keys(item[`revenue${year}`])) {
              if(child.client_frenchiseName === 'MRR'){
                child[`revenue${year}`][month] += item[`revenue${year}`][month];
              }
            }
          })
        })
      })

      // SET VALUE FOR MRR TOTAL REVENUE YEAR
      this.pinnedTopRowData[0].children.forEach(child =>{
        if(child.client_frenchiseName === 'MRR'){
          revenueYears.forEach(year =>{
            for (const month of Object.keys(child[`revenue${year}`])) {
              child[`totalRevenue${year}`] = child[`revenue${year}`][month] != null ? child[`totalRevenue${year}`] + (child[`revenue${year}`][month]) : null;
            }
          })
        } 
      })

      //SET ARR REVENUE MOTNH VALUE (MRR * 12)
      let mrrIndex = this.pinnedTopRowData[0].children.findIndex(item => item.client_frenchiseName === 'MRR');
      this.pinnedTopRowData[0].children.forEach(child =>{
        revenueYears.forEach(year =>{
          for (const month of Object.keys(child[`revenue${year}`])) {
            if(child.client_frenchiseName === 'ARR'){
              child[`revenue${year}`][month] = this.pinnedTopRowData[0].children[mrrIndex][`revenue${year}`][month] * 12;
            }
          }
        })
      })

      data.unshift(...this.pinnedTopRowData)

      const currentDate = new Date();
      const lastFullMonth = new Date(currentDate);
      lastFullMonth.setMonth(lastFullMonth.getMonth() - 1);
      const lastMonthFormatted = lastFullMonth.toLocaleDateString("en-US", { month: "short", year: "numeric"});
      const modifiedColumnDefs = [
        ...this.columnDef.slice(0,7),
        {
          headerName: `Status as of ${lastMonthFormatted}`,
          field: 'status',
          sortable: true,
          width: 200,
          minWidth: 100,
          resizable: true,
          lockPinned: true,
        },
        ...this.columnDef.slice(-1),
      ]

      this.columnDef = modifiedColumnDefs;

      let fakeServer = FakeServer(data,this.expandedRows,this.gridData);
      let datasource = getServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    })
  
  }

  onItemsPerPageChange(newPageSize: any) {
    this.rowIndex = null;
    if (newPageSize === 'all') {
      this.gridApi.paginationSetPageSize(Number.MAX_SAFE_INTEGER);
    } else {
      this.gridApi.paginationSetPageSize(Number(newPageSize));
    }
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
    this.gridColumnApi.resetColumnState();
  }

  onSelectionChanged(event: any) {
    this.totalRows = this.gridApi.getModel().getRowCount();
    if (event.source === 'uiSelectAll') {
      const rowNodes = event.api.rowModel.nodeManager.rowNodes;
      const matchedRowNodes = Object.entries(rowNodes)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => value);
      this.isExpanded = !this.isExpanded;
      let allNodesExpanded;
      const checkbox = document.querySelector('.ag-checkbox-input-wrapper');
      new Promise((resolve, reject) => {
        matchedRowNodes.forEach((node: any) => {
          if (node.level === 0) {
            node.setExpanded(this.isExpanded);
            if (node.rowIndex && node.expanded) {
              allNodesExpanded = true;
            } else if (node.rowIndex && !node.expanded) {
              allNodesExpanded = false;
            }
          }
        });
        resolve(allNodesExpanded)
      }).then((value : any) => {
          if(value === true) {
            checkbox.classList.add('icon-clicked');
            } else {
            checkbox.classList.remove('icon-clicked');
            }
          }
      ).catch((err) => 
        console.log(err)
      );
    } else if (event.source === 'rowClicked') {
      this.selectedNodes = this.gridOptions.api.getSelectedNodes();
      if (this.selectedNodes.length === 1) {
        this.rowIndex = this.selectedNodes[0].rowIndex;
      }
    }
  }

  onSearch(){
    this.rowIndex = null;
    setTimeout(() => {
      let term = (document.getElementById('filter-text-box') as HTMLInputElement).value.toLowerCase();
      this.postLoginService.getSearchedTableData(term,this.saasRevenueUrl).subscribe(data=>{
        data = this.getSortedData(data);

        data.forEach(item=>{
          item.children = this.getSortedData(item.children);
        })

        data.forEach(parent => {
          parent.children.forEach(child => {
            for (const year of ['2025', '2024', '2023', '2022', '2021']) {
                for (const month of Object.keys(child[`revenue${year}`])) {
                    parent[`revenue${year}`] = parent[`revenue${year}`] || {};
                    parent[`revenue${year}`][month] = (parent[`revenue${year}`][month] || 0) + (child[`revenue${year}`][month] || 0);
                }
                parent[`totalRevenue${year}`] = (parent[`totalRevenue${year}`] || 0) + (child[`totalRevenue${year}`] || 0);
            }
          });
        });

        data.forEach(item =>{
          item.children = item.children.filter(child => this.postLoginService.checkPropertyValue(child,term))
        })
        this.handleSearchAndExpansion(data, term);
        data.unshift(...this.pinnedTopRowData)
        let fakeServer = FakeServer(data,this.expandedRows,this.gridData);
        let datasource = getServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      })
    }, 1000);
  }

  getSortedData(data){
    return data.sort((a:any, b:any) => {
      if (a.status === "Active" && b.status === "Inactive") {
        return -1; 
      } else if (a.status === "Inactive" && b.status === "Active") {
        return 1; 
      } else {
        let franchiseA  =a.client_frenchiseName.toLowerCase()
        let franchiseB =b.client_frenchiseName.toLowerCase()
        return franchiseA.localeCompare(franchiseB)
      }
    });
  }

  onPaginationButtonClicked() {
    let term = (document.getElementById('filter-text-box') as HTMLInputElement)
      .value;
    if (term) {
      this.postLoginService.getSearchedTableData(term,this.saasRevenueUrl).subscribe((data) => {
        this.handleSearchAndExpansion(data, term);
      });
    }
  }

  handleSearchAndExpansion(data, term){
    const filterModel = this.gridApi.getFilterModel();
    const isFilterApplied = Object.keys(filterModel).length > 0;

    let searchFlag = false;
    setTimeout(() => {
      data.forEach((item) => {
        searchFlag = this.postLoginService.checkPropertyValue(item.children,term);
        if (searchFlag && !isFilterApplied) {
          const nodeData = this.gridData.api.rowModel.nodeManager.rowNodes;
          const mapped = Object.keys(nodeData).map((key) => ({
            value: nodeData[key],
          }));
          if (term) {
            mapped.forEach((node) => {
              if (item.client_frenchiseName === node.value.key) {
                node.value.setExpanded(true);
              }
            });
          } else {
            mapped.forEach((node) => {
              if (item.client_frenchiseName === node.value.key) {
                node.value.setExpanded(false);
              }
            });
          }
        }
      });
    }, 1000);
  }

  onCreateNew(){
    this.router.navigate(['/reports/saas-revenue/new-client'])
  }

  onAddColumn(){
    this.addColumnPopUp = true;
    let columnArray = this.gridApi.getColumnDefs()
    this.statusColIndex = columnArray.findIndex(column => column.colId === 'status');
    let lastYearColumn = columnArray[this.statusColIndex-1];
    this.yearToAdd = (parseInt(lastYearColumn.headerName.match(/\d+/)[0]) + 1);
  }
  
  onCloseColumnPopUp(){
    this.addColumnPopUp = false;
  }

  onAddYearColumn(){
    let currentTableData = [];    
    const nodeData = this.gridApi.rowModel.nodeManager.rowNodes;
    const mapped = Object.keys(nodeData).map((key)=> ({ value: nodeData[key]}));
    mapped.forEach(node=>{
      currentTableData.push(node.value.data)
    })

    this.addColumnPopUp = false;
    const modifiedColumnDefs = [
      ...this.columnDef.slice(0,this.statusColIndex),
      {
        field:'',
        headerName:`${this.yearToAdd} total revenue`,
        marryChildren: true,
        children: [
          { field:`totalRevenue${this.yearToAdd}`, headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter', headerClass: 'hide-header-name', suppressFillHandle:true, valueFormatter: this.customCurrencyFormatter,
          },
          { field: `revenue${this.yearToAdd}.jan`, headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.feb`, headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.mar`, headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.apr`, headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.may`, headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.jun`, headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.jul`, headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.aug`, headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.sep`, headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.oct`, headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.nov`, headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}.dec`, headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        ]
      },
      ...this.columnDef.slice(this.statusColIndex),
    ]

    this.columnDef = modifiedColumnDefs;     
    this.gridApi.setColumnDefs(modifiedColumnDefs);
    let months = Object.keys(currentTableData[0][`revenue${this.yearToAdd -1}`]);
    const revenueYears = Object.keys(currentTableData[0]).filter(key => key.startsWith('revenue')).map(key => key.slice(7)); 
    revenueYears.push(this.yearToAdd.toString());

    currentTableData.forEach(item =>{
      if(item.client_frenchiseName != this.summaryRowName){
        item[`revenue${this.yearToAdd}`] = {
          "jan": '',
          "feb": '',
          "mar": '',
          "apr": '',
          "may": '',
          "jun": '',
          "jul": '',
          "aug": '',
          "sep": '',
          "oct": '',
          "nov": '',
          "dec": ''}
      }
    })

    currentTableData.forEach(item =>{
      if(item.client_frenchiseName != this.summaryRowName && item.client_frenchiseName != 'ARR'){
        item[`totalRevenue${this.yearToAdd}`] = item[`revenue${this.yearToAdd -1}`]['dec'];
        months.forEach(month =>{
          item[`revenue${this.yearToAdd}`][month] = item[`revenue${this.yearToAdd -1}`]['dec']
        })
      }
    })

    currentTableData.forEach(item =>{
      if(item.children && item.client_frenchiseName != this.summaryRowName){
        item.children.forEach(child =>{
          child[`revenue${this.yearToAdd}`] = {
            "jan": '',
            "feb": '',
            "mar": '',
            "apr": '',
            "may": '',
            "jun": '',
            "jul": '',
            "aug": '',
            "sep": '',
            "oct": '',
            "nov": '',
            "dec": ''}
        })
      }
      if(item.children && item.client_frenchiseName != this.summaryRowName){
        item.children.forEach(child => {
          child[`totalRevenue${this.yearToAdd}`] = child[`revenue${this.yearToAdd -1}`]['dec'];
          months.forEach(month =>{
            child[`revenue${this.yearToAdd}`][month] = child[`revenue${this.yearToAdd -1}`]['dec'];
          })
        })
      }
    })

    this.pinnedTopRowData[0].children.forEach((child,index) => {
      child.clientId = this.pinnedTopRowData[0].clientId + index + 1;
      if(child.client_frenchiseName === 'MRR'){
        child[`totalRevenue${this.yearToAdd}`] = 0;
      }
      if (!child[`revenue${this.yearToAdd}`]) {
        child[`revenue${this.yearToAdd}`] = {};
      }
      months.forEach(month => {
        if (!child[`revenue${this.yearToAdd}`][month]) {
          child[`revenue${this.yearToAdd}`][month] = 0;
        }
      })
    })

    // SET SUMMARY ROW MRR REVENUE MONTH VALUE
    currentTableData.forEach(item =>{
      if(item.client_frenchiseName != this.summaryRowName){
        this.pinnedTopRowData[0].children.forEach(child => {
          months.forEach(month => {
            if(child.client_frenchiseName === 'MRR'){
              child[`revenue${this.yearToAdd}`][month] += item[`revenue${this.yearToAdd -1}`]['dec'];
            }
          })
        })
      }
    })

    // SET SUMMARY ROW MRR TOTAL REVENUE YEAR VALUE
    this.pinnedTopRowData[0].children.forEach(child =>{
      if(child.client_frenchiseName === 'MRR'){
        months.forEach(month => {
          child[`totalRevenue${this.yearToAdd}`] = child[`revenue${this.yearToAdd}`][month] != null ? child[`totalRevenue${this.yearToAdd}`] + (child[`revenue${this.yearToAdd}`][month]) : null;
        })
      } 
    })

    // SET ARR REVENUE MOTNH VALUE (MRR * 12)
    let mrrIndex = this.pinnedTopRowData[0].children.findIndex(item => item.client_frenchiseName === 'MRR');
    this.pinnedTopRowData[0].children.forEach(child =>{
      months.forEach(month =>{
        if(child.client_frenchiseName === 'ARR'){
          child[`revenue${this.yearToAdd}`][month] = this.pinnedTopRowData[0].children[mrrIndex][`revenue${this.yearToAdd}`][month] * 12;
        }
      })
    })
  }
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      setTimeout(() => {
        var response = server.getData(params.request);
        if (response.success) {
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

function FakeServer(allData, rowsToExpand?, gridData?) {
  var processedData = processData(allData);
  alasql.options.cache = false;
  var filterItem : any;
  let rowNodes : any[];
  let matchedRowNodes : any[];
  let columnName : string;
  let results : any[];

  return {
    getData: function (request) {
      const hasFilter = request.filterModel && Object.keys(request.filterModel).length;
      results = executeQuery(request, hasFilter);
      
      if (hasFilter) {
        results = recursiveFilter(request, results);  

        // MANAGING ROWS CLOSE STATE 
        setTimeout(()=>{
          rowNodes = gridData.api.rowModel.nodeManager.rowNodes;
          matchedRowNodes = Object.entries(rowNodes)
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value);
            results.forEach(item=>{       
                matchedRowNodes.forEach((node: any) => {
                  if (item.client_frenchiseName === node.key) {
                    node.setExpanded(false);
                  }
                })
            })
        },200)

        // KEEP MANUALLY EXPANDED ROWS AS IT IS
        setTimeout(() => {
          rowNodes = gridData.api.rowModel.nodeManager.rowNodes;
          matchedRowNodes = Object.entries(rowNodes)
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value);
          matchedRowNodes.forEach((node: any) => {
            rowsToExpand.forEach((item) => {
              if (item === node.key) {
                node.setExpanded(true);
              }
            });
          });
        }, 100);

        // EXPAND PARENT ROW ON CHILD MATCH
        setTimeout(()=>{
          results.forEach(item=>{
            if(item.children != undefined && item.children.length > 0 && item.client_frenchiseName != 'Saas Revenue Summary'){            
              matchedRowNodes.forEach((node: any) => {
                if (item.client_frenchiseName === node.key) {
                  node.setExpanded(true);
                }
              })
            }
          })
        },200)

      }   
      else{
        processedData = processData(allData);
        results = executeQuery(request, hasFilter);
      }

      return {
        success: true,
        rows: results,
        lastRow: getLastRowIndex(request),
      };
    },
  };

  function checkChildValues(child,nestedCol,term){
    let value;
    if(nestedCol == true){
      let fieldName = columnName.split('.')[0];    
      let monthColumn = columnName.split('.')[1];
      value = child[fieldName][monthColumn];
    }
    else if(nestedCol == false){
      value = child[columnName]
    }
    return checkPropertyValue(value,term)
  }

  function searchObject(obj: any, term: string): boolean {
    if(obj){
      return Object.entries(obj).some(([key, value]) => {
        if (key === 'clientId' || key === 'dataPath' || key ==='parentPath') {
          return false;
        }
        return checkPropertyValue(value, term);
      });
    }
    else{
      return false;
    }
  }

  function checkPropertyValue(value: any, term: any): boolean {
    if (typeof value === 'string') {
      if(typeof term === 'string' && term.toLowerCase() != 'active' && term.toLowerCase() != 'inactive'){
        return value.toLowerCase().includes(term.toLowerCase());
      }
      else if(typeof term === 'string' && (term.toLowerCase() === 'active' || term.toLowerCase() === 'inactive')){
        return value.toLowerCase() === term.toLowerCase()
      }
      else{
        return false;
      }
    } else if (typeof value === 'number') {
      return value === term;
    } else if (Array.isArray(value)) {
      return value.some((item) => checkPropertyValue(item, term));
    } else if (typeof value === 'object') {
      return searchObject(value, term);
    } else { 
      return false;
    }
  }

  function executeQuery(request, ignoreLimit) {
    var sql = buildSql(request, ignoreLimit);
    var filterModel = request.filterModel;   
    if (filterModel && Object.keys(filterModel).length) {
      const startIndex = sql.indexOf('WHERE') + 5;
      let newcondition = sql.substring(startIndex).trim();

      let sqlPart = `SELECT * FROM ? WHERE (dataPath LIKE '%saas revenue summary%') OR `;
      sql = sqlPart+newcondition;
    }

    return alasql(sql, [processedData]);
  }

  function buildSql(request, ignoreLimit) {
    return 'SELECT * FROM ?' + whereSql(request) + orderBySql(request);
  }

  function whereSql(request) {
    var whereParts = [];
    var filterModel = request.filterModel;   
    if (filterModel && Object.keys(filterModel).length) {
      Object.keys(filterModel).forEach(function (key) {
        filterItem = filterModel[key];
        if (key.includes('.')) {
          key = key.replace('.', '->');
        } else if (key === 'ag-Grid-AutoColumn') {
          key = 'client_frenchiseName';
        }

        switch (filterItem.filterType) {
          case 'text':
            whereParts.push(createFilterSql(textFilterMapper, key, filterItem));
            break;
          case 'number':
            whereParts.push(
              createFilterSql(numberFilterMapper, key, filterItem)
            );
            break;
          case 'set':
            whereParts.push(createSetFilterSql(key, filterItem.values));
            break;
          default:
            break;
        }
      });
    } else {
      whereParts.push("(parentPath = '" + request.groupKeys.join(',') + "')");
    }

    if (whereParts.length > 0) {
      return ' WHERE ' + whereParts.join(' AND ');
    }

    return '';
  }

  function createSetFilterSql(key, values) {
    return key + " IN ('" + values.join("', '") + "')";
  }

  function createFilterSql(mapper, key, item) {
    if (item.operator) {
      const conditions = item.conditions.map((condition) =>
        mapper(key, condition)
      );

      return '(' + conditions.join(' ' + item.operator + ' ') + ')';
    }

    return mapper(key, item);
  }

  function textFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
        return key + " = '" + item.filter + "'";
      case 'notEqual':
        return key + " != '" + item.filter + "'";
      case 'contains':
        return key + " LIKE '%" + item.filter + "%'";
      case 'notContains':
        return key + " NOT LIKE '%" + item.filter + "%'";
      case 'startsWith':
        return key + " LIKE '" + item.filter + "%'";
      case 'endsWith':
        return key + " LIKE '%" + item.filter + "'";
      case 'blank':
        return key + ' IS NULL or ' + key + " = ''";
      case 'notBlank':
        return key + ' IS NOT NULL and ' + key + " != ''";
      default:
        throw new Error('Unknown number filter type: ' + item.type);
    }
  }

  function numberFilterMapper(key, item) {
    switch (item.type) {
      case 'equals':
        return key + ' = ' + item.filter;
      case 'notEqual':
        return key + ' != ' + item.filter;
      case 'greaterThan':
        return key + ' > ' + item.filter;
      case 'greaterThanOrEqual':
        return key + ' >= ' + item.filter;
      case 'lessThan':
        return key + ' < ' + item.filter;
      case 'lessThanOrEqual':
        return key + ' <= ' + item.filter;
      case 'inRange':
        return (
          '(' +
          key +
          ' >= ' +
          item.filter +
          ' and ' +
          key +
          ' <= ' +
          item.filterTo +
          ')'
        );
      case 'blank':
        return key + ' IS NULL';
      case 'notBlank':
        return key + ' IS NOT NULL';
      default:
        throw new Error('Unknown number filter type: ' + item.type);
    }
  }

  function orderBySql(request) {
    var sortModel = request.sortModel;
    if (sortModel.length === 0) return '';
    var sorts = sortModel.map(function (s) {
      if (s.colId === 'ag-Grid-AutoColumn') {
        s.colId = 'client_frenchiseName';
      }
      return s.colId + ' ' + s.sort.toUpperCase();
    });

    return ' ORDER BY ' + sorts.join(', ');
  }

  function getLastRowIndex(request) {
    const hasFilter =
      request.filterModel && Object.keys(request.filterModel).length;
    var results = executeQuery(request, hasFilter);
    if (hasFilter) {
      results = recursiveFilter(request, results);
    }
    return results.length;
  }

  function processData(data) {
    const flattenedData = [];
    const flattenRowRecursive = (row, parentPath) => {
      const dataPath = [...parentPath, row.client_frenchiseName];
      flattenedData.push({
        ...row,
        dataPath: dataPath.join(','),
        parentPath: parentPath.join(','),
        children: row.children,
      });
      if (row.children) {
        row.children.forEach((underling) =>
          flattenRowRecursive(underling, dataPath)
        );
      }
    };
    data.forEach((row) => flattenRowRecursive(row, []));
    return flattenedData;
  }

  function recursiveFilter(request, results) { 
    const allResults = [...results];
    recursiveFilterParentMatches(allResults, results);
    recursiveFilterChildMatches(allResults, results);
    const requestPath = request.groupKeys.join(',');
    const sql =
      "SELECT DISTINCT processedData.* FROM ? processedData INNER JOIN ? allResults ON processedData.dataPath = allResults.dataPath WHERE parentPath = '" +
      requestPath +
      "'" +
      orderBySql(request);

    let data = alasql(sql, [processedData, allResults]);
    
    var filterModel = request.filterModel; 

    if (filterModel && Object.keys(filterModel).length) {
      Object.keys(filterModel).forEach(function (key) {
        filterItem = filterModel[key]; 
        let isMultipleCondition = Object.keys(filterModel[key]).some(key => key.startsWith('condition'));
        if (key === 'ag-Grid-AutoColumn') {
          key = 'client_frenchiseName';
        }
        columnName = key;
        let nestedColumns = key.includes('.') ? true : false;  
        let childFlag;
        let filteredchild = [];
        
        // FOR HANDLING MONTH DATA
        if(((Object.keys(filterModel).length == 1) && (typeof filterItem.filter == 'number')) || ((Object.keys(filterModel)).length > 1 && Object.values(filterModel).every((obj:any) => obj.filterType === 'number'))){

          let res = data.filter(item=>{
            return Object.keys(item).some(property => {
              if (property === columnName) {
                return checkPropertyValue(item[property], filterItem.filter);
              }
              else if(property === 'children' && item.children != undefined){
                item.children.filter( child => {
                  childFlag = checkChildValues(child,nestedColumns,filterItem.filter);
                })
                return childFlag;
              } 
              else {
                if(item[property] === 'Saas Revenue Summary' || item[property] === 'ARR' || item[property] === 'MRR'){
                  return true;
                }
                else{
                  if(item.client_frenchiseName === 'Saas Revenue Summary' || item.client_frenchiseName === 'ARR' || item.client_frenchiseName === 'MRR'){
                    return true;
                  }
                  else{
                    if(item.children){
                      item.children = item.children.filter(child => {

                        if(filterItem.type != 'notEqual'){
                          let flag = (typeof filterItem.filter != 'number') ? 
                          checkPropertyValue(child,filterItem.filter) : checkChildValues(child,nestedColumns,filterItem.filter);
                          return flag;
                        }
                        else{
                          let flag = (typeof filterItem.filter != 'number') ? 
                          !checkPropertyValue(child,filterItem.filter) : !checkChildValues(child,nestedColumns,filterItem.filter);
                          return flag;
                        }                       
                      })
                    }
                  } 
                  if(filterItem.type != 'notEqual'){
                    return checkPropertyValue(item,filterItem.filter);
                  }
                  else{
                    return !checkPropertyValue(item,filterItem.filter);
                  }

                }
              }
            });
          });
          data = res.length > 0 ? res : data;
        }

        // IF ONE FILTER CONDITION APPLIED 
        else if(!isMultipleCondition){
          filteredchild = data.filter(item =>{
            if((typeof filterItem.filter == 'number')){ // FOR REVENUE MONTH CHILD 
              let res = data.filter(item=>{
                return Object.keys(item).some(property => {

                  if(property === 'children' && item.children != undefined){
                    item.children.filter( child => {
                      childFlag = checkChildValues(child,nestedColumns,filterItem.filter);
                    })
                    return childFlag;
                  } 
                  else {
                    if(item[property] === 'Saas Revenue Summary' || item[property] === 'ARR' || item[property] === 'MRR'){
                      return true;
                    }
                    else{
                      if(item.client_frenchiseName === 'Saas Revenue Summary' || item.client_frenchiseName === 'ARR' || item.client_frenchiseName === 'MRR'){
                        return true;
                      }
                      else{
                        if(item.children){
                          item.children = item.children.filter(child => {
                            let flag = (typeof filterItem.filter != 'number') ? 
                            checkPropertyValue(child,filterItem.filter) : checkChildValues(child,nestedColumns,filterItem.filter);
                            return flag;
                          })
                        }
                      } 
                      return checkPropertyValue(item,filterItem.filter);
                    }
                  }
                });
              });
              data = res.length > 0 ? res : data;
              return data;
            }
            else if(filterItem.filter === 'active'){ // FOR EXACT MATCH OF STATUS : ACTIVE
              if(item.client_frenchiseName === 'Saas Revenue Summary' || item.client_frenchiseName === 'ARR' || item.client_frenchiseName === 'MRR'){
                return true;
              }else if(item.status){
                if(item.children){
                  item.children = item.children.filter(child => {
                    let flag = checkPropertyValue(child,filterItem.filter);
                    return flag;
                  })
                }
                return checkPropertyValue(item[key].toLowerCase(),filterItem.filter);
              }
            }
            else if(typeof item[key] === 'string' && item.children === undefined && item[key] != 'active'){
              if(item[key] === 'Saas Revenue Summary' || item[key] === 'ARR' || item[key] === 'MRR'){
                return true;
              }else{
                if(filterItem.type != 'notContains'){
                  return checkPropertyValue(item[key].toLowerCase(),filterItem.filter);
                }
                else{
                  return !checkPropertyValue(item[key].toLowerCase(),filterItem.filter);
                }
              }
            }
            else if(typeof item[key] != 'string' && item.children === undefined){
              return checkPropertyValue(item[key],filterItem.filter);
            }
            else{
              if(item.client_frenchiseName === 'Saas Revenue Summary' || item.client_frenchiseName === 'ARR' || item.client_frenchiseName === 'MRR'){
                return true;
              }
              else{
                if(item.children){
                  item.children = item.children.filter(child=>{
                      if(filterItem.type != 'notContains'){
                      return checkPropertyValue(child[key],filterItem.filter)
                    }
                    else{
                      return !checkPropertyValue(child[key],filterItem.filter);
                    }
                  })
                }
              } 
              return true;
            }
          })
          data = filteredchild;
        }
        // IF MULTIPLE CONDITIONS APPLIED
        else{
          columnName = columnName === 'client_frenchiseName' ? 'ag-Grid-AutoColumn' : columnName;
          let isRevenueMonthCol = columnName.includes('.') ? true : false;  
          
          if(isRevenueMonthCol){
            data.filter(item=>{
              return Object.keys(item).some(property => {
                if (property === columnName) {
                  return checkPropertyValue(item[property], filterItem.filter);
                }
                else if(property === 'children' && item.children != undefined){
                  item.children.filter( child => {
                    childFlag = checkChildValues(child,nestedColumns,filterItem.filter);
                  })
                  return childFlag;
                } 
                else {
                  return false;
                }
              });
            });

          }
          else{
            filterModel[columnName].conditions.forEach(filterItem=>{
             data.filter(item =>{
                if(typeof item[key] === 'string' && item.children === undefined){
                  return checkPropertyValue(item[key].toLowerCase(),filterItem.filter);
                }
                else if(typeof item[key] != 'string' && item.children === undefined){
                  return checkPropertyValue(item[key],filterItem.filter);
                }
                else{
                  if(item.children){
                    item.children = item.children.filter(child=>{
                      return checkPropertyValue(child[key],filterItem.filter)
                    })
                  }
                  return checkPropertyValue(item[key],filterItem.filter);
                }
              })
              
            })
          }          
        }
      })
    }    
    return data;
  }

  function recursiveFilterParentMatches(allResults, childResults) {
    if (!childResults.length) {
      return;
    }
    const sql =
      'SELECT DISTINCT processedData.* FROM ? processedData INNER JOIN ? parentResults ON processedData.dataPath = parentResults.parentPath';
    const newMatches = alasql(sql, [processedData, childResults]).filter(
      (newResult) =>
        !allResults.some(
          (existingResult) => newResult.dataPath === existingResult.dataPath
        )
    );
    allResults.push(...newMatches);
    recursiveFilterParentMatches(allResults, newMatches);
  }

  function recursiveFilterChildMatches(allResults, parentResults) {
    if (!parentResults.length) {
      return;
    }
    const sql =
      'SELECT DISTINCT processedData.* FROM ? processedData INNER JOIN ? parentResults ON processedData.parentPath = parentResults.dataPath';
    const newMatches = alasql(sql, [processedData, parentResults]).filter(
      (newResult) =>
        !allResults.some(
          (existingResult) => newResult.dataPath === existingResult.dataPath
        )
    );
    allResults.push(...newMatches);
    recursiveFilterChildMatches(allResults, newMatches);
  }
}