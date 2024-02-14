import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IServerSideDatasource, RowModelType, SideBarDef } from 'ag-grid-community';
import { PostLoginService } from '../../post-login.service';
import { Router } from '@angular/router';
import { PaginationOption } from '../../post-login.modal';
import * as alasql from 'alasql';

@Component({
  selector: 'app-announcement-management',
  templateUrl: './announcement-management.component.html',
  styleUrls: ['./announcement-management.component.scss']
})
export class AnnouncementManagementComponent {

  announcementDataUrl = "assets/announcement-data.json";

  constructor(private postLoginService : PostLoginService, private renderer: Renderer2,private ele: ElementRef,private router:Router){}
  isAnnouncementEditable : boolean = false;
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

  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];
  defaultStatus = "Inactive";
  isStatusDropDownOpen : boolean = false;

  columnDef : ColDef[] = [
    {
      field:'title',
      headerName:'Announcement title',
      pinned:'left',
      lockPinned:true,
      width:500
    },
    {
      field:'subtitle',
      headerName:'Announcement Subtitle',
      width:500
    },
    {
      field:'status',
      headerName:'Announcement Status',
      width:300,
    },
    {
      field: 'actions',
      headerName: '',
      headerClass: 'action-header',
      cellClass: 'actionsField',
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: this.customCellRenderer.bind(this),
      sortable:false,
      filter:false,
      floatingFilter:false
    },
  ]

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    sortable:true
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
  };
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

    this.postLoginService.getTableData(this.announcementDataUrl).subscribe(data=>{
      this.totalRows = this.gridApi.paginationGetPageSize();
      let fakeServer = createFakeServer(data);
      let datasource = createServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    });
  }

  customCellRenderer(params: any): HTMLElement {
    const self = this;
    const cellElement = document.createElement('div');
    cellElement.classList.add('d-flex', 'custom-gap');

    const editDiv = document.createElement('div');
    editDiv.classList.add('d-flex', 'flex-column', 'edit-div');

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-status');
    editButton.innerHTML = '<img src="assets/images/edit-icon.svg" class="action-icons">';
    editButton.addEventListener('click', function () {
      self.isAnnouncementEditable = true;
    });

    const editLabel = document.createElement('p');
    editLabel.classList.add('edit-label');
    editLabel.textContent = 'Edit';

    editDiv.appendChild(editButton);
    editDiv.appendChild(editLabel);

    cellElement.appendChild(editDiv);
    return cellElement;
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

  onSelectionChanged(event:any){
    this.selectedNodes = this.gridOptions.api.getSelectedNodes();
    if (this.selectedNodes.length === 1) {
      this.rowIndex = this.selectedNodes[0].rowIndex;
    }
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

  onSearch(){
    this.rowIndex = null;
    setTimeout(() => {
      let term = (document.getElementById('filter-text-box') as HTMLInputElement).value.toLowerCase();
      this.postLoginService.getSearchedTableData(term,this.announcementDataUrl).subscribe(data=>{
        this.handleSearchAndExpansion(data, term)
        let fakeServer = createFakeServer(data);
        let datasource = createServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      })
    }, 400);
  }

  onPaginationButtonClicked() {
    let term = (document.getElementById('filter-text-box') as HTMLInputElement)
      .value;
    if (term) {
      this.postLoginService.getSearchedTableData(term,this.announcementDataUrl).subscribe((data) => {
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
    this.isAnnouncementEditable = true;
  }

  onCloseAnnouncementPanel(){
    this.isAnnouncementEditable = false;
  }

  statusDropDownOpen(event:any){
    this.isStatusDropDownOpen = true;
  }

  statusDropDownClose(event:any){
    this.isStatusDropDownOpen = false;
  }

  onSaveChanges(){
    this.isAnnouncementEditable = false;
  }

  onCancel() {
    this.isAnnouncementEditable = false;
  }
}

function createServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      const response = server.getData(params.request);
      setTimeout(() => {
        if (response.success) {
          params.success({ rowData: response.rows });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

function createFakeServer(allData: any[]) {
  alasql.options.cache = false;
  var filterItem;
  return {
    getData: function (request) {
      const hasFilter = request.filterModel && Object.keys(request.filterModel).length;            
      var results = executeQuery(request);
      if (hasFilter) {
        var filterModel = request.filterModel; 
        if(filterModel && Object.keys(filterModel).length) {
          Object.keys(filterModel).forEach(function (key) {
            filterItem = filterModel[key]; 
            results = results.filter(item => searchObject(item,filterItem.filter));
          })
        }
      }   
      else{
        results = executeQuery(request);
      }

      return {
        success: true,
        rows: results,
        lastRow: getLastRowIndex(request),
      };
    },
  };

  function searchObject(obj: any, term: string): boolean {
    return Object.entries(obj).some(([key, value]) => {
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

  function executeQuery(request) {
    var sql = buildSql(request);
    return alasql(sql, [allData]);
  }

  function buildSql(request) {
    return (
      'SELECT * FROM ?' +
      whereSql(request) +
      orderBySql(request) +
      limitSql(request)
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
        throw new Error('Unknown number filter type: ' + item.type);
    }
  }

  function orderBySql(request) {
    var sortModel = request.sortModel;
    if (sortModel.length === 0) return '';
    var sorts = sortModel.map(function (s) {
      return s.colId + ' ' + s.sort.toUpperCase();
    });
    return ' ORDER BY ' + sorts.join(', ');
  }

  function limitSql(request) {
    if (request.endRow == undefined || request.startRow == undefined) {
      return '';
    }
    var blockSize = request.endRow - request.startRow;
    return ' LIMIT ' + blockSize + ' OFFSET ' + request.startRow;
  }

  function getLastRowIndex(request) {
    return executeQuery({ ...request, startRow: undefined, endRow: undefined })
      .length;
  }
}