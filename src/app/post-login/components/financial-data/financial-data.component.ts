import { Component, ElementRef, Renderer2} from '@angular/core';
import { ColDef, GetServerSideGroupKey, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, IServerSideDatasource, IsServerSideGroup, RowModelType, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from '../../post-login.modal';
import { PostLoginService } from '../../post-login.service';
import { HttpClient } from '@angular/common/http';
import * as alasql from 'alasql';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styleUrls: ['./financial-data.component.scss']
})
export class FinancialDataComponent {
  saasRevenueUrl = "assets/saas-revenue-data.json";

  constructor(private postLoginService : PostLoginService, private renderer: Renderer2,private ele: ElementRef, private http:HttpClient){}

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
          headerClass: 'hide-header-name',hide:true,
        },
        { field: 'revenue2021.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
        { field: 'revenue2021.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, },
      ]
    },
    {
      field:'',
      headerName:'2022 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2022', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true
        },
        { field: 'revenue2022.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2022.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
      ]
    },
    {
      field:'',
      headerName:'2023 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2023', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',
        },
        { field: 'revenue2023.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2023.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
      ]
    },
    {
      field:'',
      headerName:'2024 total revenue',
      marryChildren: true,
      openByDefault:true,
      children: [
        { field: 'totalRevenue2024', headerName :'Total', columnGroupShow :null, minWidth: 70,filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',
        },
        { field: 'revenue2024.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
        { field: 'revenue2024.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' },
      ]
    },    
    {
      field:'',
      headerName:'2025 total revenue',
      marryChildren: true,
      children: [
        { field: 'totalRevenue2025', headerName :'Total', columnGroupShow :null, minWidth: 70,filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true
        },
        { field: 'revenue2025.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
        { field: 'revenue2025.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true },
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
          return `<a href='#' class='parent-link'> <div class='dot-container'>${params.value}</a>`
        }
        else{
          return `${params.value}`
        }
      },
    },
  };

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
    } else {
      this.expandedRows.delete(event.node.key);
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.postLoginService.getTableData(this.saasRevenueUrl).subscribe(data=>{
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
      this.totalRows = this.gridApi.paginationGetPageSize();

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
    this.totalRows = this.gridApi.paginationGetPageSize();
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
        data.forEach(item =>{
          item.children = item.children.filter(child => this.postLoginService.checkPropertyValue(child,term))
        })
        this.handleSearchAndExpansion(data, term)
        let fakeServer = FakeServer(data,this.expandedRows,this.gridData,);
        let datasource = getServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      })
    }, 1000);
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

            this.expandedRows.forEach(item =>{
              mapped.forEach((node) => {
                if (item === node.value.key) {
                  node.value.setExpanded(true);
                }
              });
            })
          }
        }
      });
    }, 1000);
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
  var filterItem;
  let rowNodes;
  let matchedRowNodes;
  let columnName : string;
  let results;

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
            if(item.children != undefined && item.children.length > 0){            
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
    return Object.entries(obj).some(([key, value]) => {
      if (key === 'clientId' || key === 'dataPath' || key ==='parentPath') {
        return false;
      }
      return checkPropertyValue(value, term);
    });
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
        if (key === 'ag-Grid-AutoColumn') {
          key = 'client_frenchiseName';
        }
        columnName = key;
        let nestedColumns = key.includes('.') ? true : false;  

        data.forEach(item =>{
          if(item.children && item.children.length > 0){
            item.children = item.children.filter( child => {
              let flag = (Object.keys(filterModel).length > 1) && (typeof filterItem.filter != 'number') ? 
                checkPropertyValue(child,filterItem.filter) : checkChildValues(child,nestedColumns,filterItem.filter);
              return flag;
            })
          } 
        }) 
      })
    }

    if (filterModel && Object.keys(filterModel).length) {
      Object.keys(filterModel).forEach(function (key) {
        filterItem = filterModel[key]; 
        if (key === 'ag-Grid-AutoColumn') {
          key = 'client_frenchiseName';
        }
        columnName = key;
        let nestedColumns = key.includes('.') ? true : false;  
        data = data.filter(item => searchObject(item,filterItem.filter));
        let childFlag;

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
                return false;
              }
            });
          });
          data = res.length > 0 ? res : data;
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