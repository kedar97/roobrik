import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IServerSideDatasource, RowModelType, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from '../../post-login.modal';
import { PostLoginService } from '../../post-login.service';
import * as alasql from 'alasql';
import { CustomMenuEditorComponent } from './custom-menu-editor/custom-menu-editor.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-groups',
  templateUrl: './custom-groups.component.html',
  styleUrls: ['./custom-groups.component.scss']
})
export class CustomGroupsComponent {

  isSmallDesktopScreen: boolean = false;
  customGroupDataUrl = "assets/custom-group-data.json";
  isGroupEditable : boolean = false;
  isStatusDropDownOpen : boolean = false;
  isClientDropDownOpen : boolean = false;
  isFranchiseDropDownOpen : boolean = false;
  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];

  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";

  selectedValue = 100;
  cacheBlockSize = 100;
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

  public form = new FormGroup({
    groupName : new FormControl(),
    client: new FormControl(),
    franchise : new FormControl(),
    internalName : new FormControl(),
    displayName : new FormControl(),
    description : new FormControl(),
    excelPassword : new FormControl(),
    status : new FormControl(),
    date: new FormControl(),
  });

  clientList :any[] = [];
  franchiseList :any[] = [];
  
  constructor(private renderer: Renderer2, private ele: ElementRef, private postLoginService: PostLoginService, private router:Router) { 
    postLoginService.isCustomGroupDetailEditable.subscribe(res =>{
      this.isGroupEditable = res;
    })

    postLoginService.selectedGroupData.subscribe((data:any)=>{
      if(data){
        this.form.setValue({
          groupName : data.group_type,
          client : '',
          franchise:'',
          internalName: data.internal_name,
          displayName: data.display_name,
          description: data.description,
          excelPassword : data.password,
          status: data.status,
          date: null
        })
      }      
    })
  }

  defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
    sortable: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  }

  gridOptions: GridOptions = {
    getRowId: function(params:any){
      if (params.data.id != null) {
        return "leaf-" + params.data.id;
      }
      
      const rowGroupCols = params.columnApi.columnModel.getRowGroupColumns();
      const rowGroupColIds = rowGroupCols.map((col) => col.getId()).join("-");
      const thisGroupCol = rowGroupCols[params.level];
      
      return (
        "group-" +
        rowGroupColIds +
        "-" +
        (params.parentKeys || []).join("-") +
        params.data[thisGroupCol.getColDef().field!]
      );
    },
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

  columnDef: ColDef[] | any = [
    {
      field: 'internal_name',
      headerName: 'Internal name',
      enableRowGroup: true,
    },
    {
      field: 'display_name',
      headerName: 'Display name',
      enableRowGroup: true
    },
    {
      field: 'description',
      headerName: 'Description',
      enableRowGroup: true,
      hide: true,
    },
    {
      field: 'group_type',
      headerName: 'Group type',
      enableRowGroup: true
    },
    {
      field: 'client_count',
      headerName: 'Client count',
      enableRowGroup: true,
      filter: 'agNumberColumnFilter'
    },
    {
      field: 'franchise_count',
      headerName: 'Franchise count',
      enableRowGroup: true,
      filter: 'agNumberColumnFilter'
    },
    {
      field: 'status',
      headerName: 'Custom Group Status',
      enableRowGroup: true,
    },
    {
      field: 'createdBy',
      headerName: 'Created by',
      enableRowGroup: true
    },
    {
      field: 'create_date',
      headerName: 'Create date',
      enableRowGroup: true,
      hide: true,
    },
    {
      field: 'deactivated_date',
      headerName: 'Deacctivated date',
      enableRowGroup: true,
      hide: true,
    },
    {
      width:60,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: CustomMenuEditorComponent,
      pinned: 'right',
      lockPinned: true,
      floatingFilter:false,
      filter:false
    },
  ]
  
  rowData: any = [];
  ngOnInit() {
    this.isSmallDesktopScreen = window.innerWidth <= 1366;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.postLoginService.getTableData(this.customGroupDataUrl).subscribe(data => {
      var fakeServer = FakeServer(data);

      data.forEach(item =>{
        let clientsCount = 0;
        let franchiseCount = 0;
        if(item.clientFranchiseData){
          item.clientFranchiseData.forEach(cf=>{
              if(cf.group === cf.client_franchiseName){
                clientsCount++;
                this.clientList.push(cf.client_franchiseName);
              }
              else{
                franchiseCount++;
                this.franchiseList.push(cf.client_franchiseName);
              }
          })
          item.client_count = clientsCount;
          item.franchise_count = franchiseCount;
        }
      })
      var datasource = getServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    })

  }

  onSearch() {
    this.rowIndex = null;
    setTimeout(() => {
      let term = (document.getElementById('filter-text-box') as HTMLInputElement).value.toLowerCase();
      this.postLoginService.getSearchedTableData(term, this.customGroupDataUrl).subscribe(data => {
        let fakeServer = FakeServer(data);
        let datasource = getServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      })
    }, 1000);
  }

  onSelectionChanged(event: any) {
    this.totalRows = this.gridApi.getModel().getRowCount();
    this.selectedNodes = this.gridOptions.api.getSelectedNodes();
    if (this.selectedNodes.length === 1) {
      this.rowIndex = this.selectedNodes[0].rowIndex;
    }
  }

  onPaginationChanged(event:any) {
    this.rowIndex = null;
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

  onCloseEditGroupPanel(){
    this.postLoginService.isCustomGroupDetailEditable.next(false);
  }

  onDropDownOpen(event:any,type : string){
    if(type === 'status'){
      this.isStatusDropDownOpen = true;
      this.isClientDropDownOpen = this.isFranchiseDropDownOpen = false;
    }
    else if(type === 'client'){
      this.isClientDropDownOpen = true;
      this.isStatusDropDownOpen = this.isFranchiseDropDownOpen = false;
    }
    else if(type === 'franchise'){
      this.isFranchiseDropDownOpen  = true;
      this.isStatusDropDownOpen = this.isClientDropDownOpen = false;
    }
  }

  onDropDownClose(event:any,type : string){
    this.isStatusDropDownOpen = this.isClientDropDownOpen = this.isFranchiseDropDownOpen = false;
  }

  onSaveChanges(form:any){
    this.form.reset();
    this.postLoginService.isCustomGroupDetailEditable.next(false);
  }

  onCancel(){
    this.postLoginService.isCustomGroupDetailEditable.next(false);
  }

  onCreateNewGroup(){
    this.router.navigate(['reports/custom-groups/create-new-custom-group'])
  }

  ngOnDestroy(){
    this.form.reset();
    this.postLoginService.isCustomGroupDetailEditable.next(false);
  }
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      var response = server.getData(params.request);
      setTimeout(() => {
        if (response.success) {
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 1000);
    },
  };
}

function FakeServer(allData) {
  alasql.options.cache = false;

  return {
    getData: function(request) {
      var results = executeQuery(request);
      return {
        success: true,
        rows: results,
        lastRow: getLastRowIndex(request)
      };
    }
  };

  function executeQuery(request) {
    var sql = buildSql(request);
    return alasql(sql, [allData]);
  }

  function buildSql(request) {
    return selectSql(request) + ' FROM ?' + whereSql(request) + groupBySql(request) + orderBySql(request) + limitSql(request);
  }

  function selectSql(request) {
    var rowGroupCols = request.rowGroupCols;
    var valueCols = request.valueCols;
    var groupKeys = request.groupKeys;

    if (isDoingGrouping(rowGroupCols, groupKeys)) {
      var rowGroupCol = rowGroupCols[groupKeys.length];
      var colsToSelect = [rowGroupCol.id];
      valueCols.forEach(function(valueCol) {
        colsToSelect.push(valueCol.aggFunc + '(' + valueCol.id + ') AS ' + valueCol.id);
      });

      return 'SELECT ' + colsToSelect.join(', ');
    }
    return 'SELECT *';
  }

  function whereSql(request) {
    var rowGroups = request.rowGroupCols;
    var groupKeys = request.groupKeys;
    var whereParts = [];
    var filterModel = request.filterModel;

    if (groupKeys) {
      groupKeys.forEach(function(key, i) {
        var value = typeof key === 'string' ? "'" + key + "'" : key;
        whereParts.push(rowGroups[i].id + ' = ' + value);
      });
    }

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
            console.log('unknown filter type: ' + item.filterType);
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
      const conditions = item.conditions.map(condition => mapper(key, condition));
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
        return key + " IS NULL or " + key + " = ''";
      case 'notBlank':
        return key + " IS NOT NULL and " + key + " != ''";
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
        return '(' + key + ' >= ' + item.filter + ' and ' + key + ' <= ' + item.filterTo + ')';
      case 'blank':
        return key + " IS NULL";
      case 'notBlank':
        return key + " IS NOT NULL";
      default:
        throw new Error('Unknown number filter type: ' + item.type);
    }
  }

  function groupBySql(request) {
    var rowGroupCols = request.rowGroupCols;
    var groupKeys = request.groupKeys;

    if(isDoingGrouping(rowGroupCols, groupKeys)) {
      var rowGroupCol = rowGroupCols[groupKeys.length];
      return ' GROUP BY ' + rowGroupCol.id + ' HAVING count(*) > 0';
    }
    return '';
  }

  function orderBySql(request) {
    var sortModel = request.sortModel;
    if (sortModel.length === 0) return '';
    var sorts = sortModel.map(function(s) {
      return s.colId + ' ' + s.sort.toUpperCase();
    });
    return ' ORDER BY ' + sorts.join(', ');
  }

  function limitSql(request) {
    if (request.endRow == undefined || request.startRow == undefined) { return ''; }
    else{
      var blockSize = request.endRow - request.startRow;
      return ' LIMIT ' + blockSize + ' OFFSET ' + request.startRow;
    }
  }

  function isDoingGrouping(rowGroupCols, groupKeys) {
    return rowGroupCols.length > groupKeys.length;
  }

  function getLastRowIndex(request) {
    return executeQuery({ ...request, startRow: undefined, endRow: undefined }).length;
  }
}