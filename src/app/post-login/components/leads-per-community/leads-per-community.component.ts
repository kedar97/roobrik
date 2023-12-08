import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ColDef, GetServerSideGroupKey, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, IServerSideDatasource, IServerSideGetRowsParams, IServerSideGetRowsRequest, IsServerSideGroup, RowModelType, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from '../../post-login.modal';
import { Params } from '@angular/router';
import { PostLoginService } from '../../post-login.service';
import * as alasql from 'alasql';


@Component({
  selector: 'app-leads-per-community',
  templateUrl: './leads-per-community.component.html',
  styleUrls: ['./leads-per-community.component.scss']


})

export class LeadsPerCommunityComponent implements OnInit {

  constructor(private renderer: Renderer2,private ele: ElementRef, private postLoginService: PostLoginService){}

  serchArrd=[];
  public rowModelType: RowModelType = 'serverSide';
  public isExpanded :boolean = false;
  statusBar:any ;
  isrowSelected : boolean = false;
  totalRows : number;
  rowIndex : number;
  selectedNodes =[];
  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData:any;
  public gridApi!: GridApi | any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  selectedValue = 10;
  cacheBlockSize = 10;
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


  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter:true,
  };

  columnDef: any  = [
    {
      headerName: 'Benchmark comparesion',
      field: 'benchmarkComparison',
      enableRowGroup:true,
      lockPinned:true,
      filter: 'agTextColumnFilter',
      headerClass:'padding-left-19',
      cellRenderer:function(params:Params){
        if(params.value === 'Above'){
          return `<div class="comparison-text green-text">${params.value}</div>`
        }
        else if(params.value === 'Below'){
          return `<div class="comparison-text red-text">${params.value}</div>`
        }
        else{
          return `<div class="comparison-text orange-text">${params.value}</div>`
        }
      }
    },

    {
      headerName: '4-month LPC average',
      field: 'lpcAverage',
      filter: 'agTextColumnFilter',
      enableRowGroup:true,
      lockPinned:true,
      width:150,
    },
    {
      headerName:'Unique SQL count',
      sortable:false,
      children :[...this.getMonthColumns('uniqueCount')],
      enableRowGroup:true,
      lockPinned:true,
    },
    {
      headerName:'Total active franchises',
      sortable:false,
      children :[...this.getMonthColumns('totalActive')],
      enableRowGroup:true,
      lockPinned:true,
    },
    {
      headerName: 'Status',
      field: 'status',
      enableRowGroup:true,
      width:200,
      filter: 'agTextColumnFilter',
      lockPinned:true,
    },
    {
      headerName: 'Account owner',
      field: 'owner',
      enableRowGroup:true,
      filter: 'agTextColumnFilter',
      lockPinned:true,
      width:200,
    },
  ]

  public columnTypes: {
    [key: string]: any;
  } = {
    number: { filter: 'agNumberColumnFilter' },
  };

  public autoGroupColumnDef: ColDef = {
    headerCheckboxSelection:true,
    headerName:'Client/frenchise Name',
    field: 'client_frenchiseName',
    enableRowGroup:true,
    width: 350,
    pinned:'left',
    lockPinned:true,
    cellStyle:{"text-overflow": "ellipsis",
      "overflow": "hidden",
      "display": "block",
      "padding-top": "4px"},
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.client_frenchiseName;
      },
    },
  };

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };
  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.clientId;
  };

  rowData!: any[];

  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels:[
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
    ]
  }

  gridOptions: GridOptions = {
    enableRangeSelection: true,
    statusBar: {
      statusPanels: [
        {
          statusPanel: 'agAggregationComponent',
          statusPanelParams: {
            aggFuncs: ['avg','count','min','max','sum', ],
          },
        },
      ],
    },
  };

  ngOnInit(): void {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.postLoginService.getTableData().subscribe((data) => {
      this.totalRows = this.gridApi.paginationGetPageSize();
      var fakeServer = createFakeServer(data);
      var datasource = createServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    });
  }

  getMonthColumns(type: string) {
    return [
      {
        headerName: 'Apr-23',
        width:80,
        filter: 'agTextColumnFilter',
        valueGetter: (params) => this.getMonthValue(params.data, type, 'apr23'),
      },
      {
        headerName: 'Mar-23',
        width:80,
        filter: 'agTextColumnFilter',
        valueGetter: (params) => this.getMonthValue(params.data, type, 'mar23'),
      },
      {
        headerName: 'Feb-23',
        width:80,
        filter: 'agTextColumnFilter',
        valueGetter: (params) => this.getMonthValue(params.data, type, 'feb23'),
      },
      {
        headerName: 'Jan-23',
        width:80,
        filter: 'agTextColumnFilter',
        valueGetter: (params) => this.getMonthValue(params.data, type, 'jan23'),
      },
    ];
  }

  getMonthValue(data: any, type: string, month: string) {
    const monthData = data[type].find((item) => Object.keys(item)[0] === month);
    return monthData ? monthData[month] : 0;
  }

  onSearch() {
    this.rowIndex =null;
    setTimeout(()=>{
      let term = (document.getElementById('filter-text-box') as HTMLInputElement).value;
      this.postLoginService.getSearchedData(term).subscribe(data=>{
        var fakeServer = createFakeServer(data);
        var datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
        let serchArr = false;
        setTimeout(() => {
          data.forEach((item)=>{
            const searchTerm = term.toLowerCase();
            serchArr= this.postLoginService.checkPropertyValue(item.children,searchTerm);
            if(serchArr){
              const nodeData =this.gridData.api.rowModel.nodeManager.rowNodes;
              const mapped = Object.keys(nodeData).map(key => ({ value:nodeData[key]}));
              if(term){
                mapped.forEach((node)=>{
                  if(item.clientId === node.value.key){
                    node.value.setExpanded(true);
                  }
                });
              }
              else{
                mapped.forEach((node)=>{
                  if(item.clientId === node.value.key){
                    node.value.setExpanded(false);
                  }
                });
              }
            }
        })
        }, 1000);
      })
    },1000)
  };


  onItemsPerPageChange(newPageSize: any) {
    this.rowIndex =null;
    if (newPageSize === 'all') {
      this.gridApi.paginationSetPageSize(Number.MAX_SAFE_INTEGER);
    } else {
      this.gridApi.paginationSetPageSize(Number(newPageSize));
    }
    this.totalRows = this.gridApi.paginationGetPageSize();
  }

  onSelectionChanged(event:any){
    if(event.source === 'uiSelectAll'){
      const data = event.api.rowModel.nodeManager.rowNodes;
      const mapped = Object.keys(data).map(key => ({ value:data[key]}));
      this.isExpanded=!this.isExpanded;
      mapped.forEach((node)=>{
        if(node.value.level === 0 ) {
          node.value.setExpanded(this.isExpanded);
        }
      });
    }
    else if( event.source === 'rowClicked'){
      this.selectedNodes = this.gridOptions.api.getSelectedNodes();
      if (this.selectedNodes.length === 1) {
        this.rowIndex = this.selectedNodes[0].rowIndex;
      }
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
    this.gridColumnApi.applyColumnState({
      state: this.defaultColumnState,
      applyOrder: true,
    });
  }
}

function createFakeServer(fakeServerData: any[]) {
  const fakeServer = {
    data: fakeServerData,
    getData: function (request: IServerSideGetRowsRequest) {
      var results = executeQuery(request);
      this.data = results;
      function extractRowsFromData(groupKeys: string[], data: any[]): any {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.children,
              clientId: d.clientId,
              client_frenchiseName: d.client_frenchiseName,
              benchmarkComparison: d.benchmarkComparison,
              lpcAverage:d.lpcAverage,
              uniqueCount:d.uniqueCount,
              totalActive:d.totalActive,
              status:d.status,
              owner:d.owner
            };
          });
        }
        var key = groupKeys[0];
        for (var i = 0; i < data.length; i++) {
          if (data[i].clientId === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].children.slice()
            );
          }
        }
      }
      return extractRowsFromData(request.groupKeys, this.data);
    },
  };

  function executeQuery(request) {
    var sql = buildSql(request);
    return alasql(sql, [fakeServerData]);
  }

  function buildSql(request) {
    return (
      'SELECT * FROM ?' + whereSql(request)
    );
  }

  function whereSql(request) {
    var whereParts = [];
    var filterModel = request.filterModel;

    if (filterModel) {
      Object.keys(filterModel).forEach(function (key) {
        var item = filterModel[key];

        switch (item.filterType) {
          case 'text':
            whereParts.push(createFilterSql(textFilterMapper, key, item));
            break;
          case 'number':
            whereParts.push(createFilterSql(numberFilterMapper, key, item));
            break;
          default:
            break;
        }
      });
    }

    if (whereParts.length > 0) {
      return ' WHERE ' + whereParts.join(' AND ');
    }
    return '';
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
        console.log('unknown number filter type: ' + item.type);
        throw new Error('Unknown number filter type: ' + item.type);
    }
  }
  return fakeServer;
}

function createServerSideDatasource(fakeServer: any) {
  const dataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      var allRows = fakeServer.getData(params.request);
      var request = params.request;
      var doingInfinite = request.startRow != null && request.endRow != null;
      var result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      setTimeout(() => {
        params.success(result);
      }, 200);
    },
  };
  return dataSource;
}
