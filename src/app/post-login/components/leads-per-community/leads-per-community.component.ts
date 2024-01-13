import { Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {
  ColDef,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IsServerSideGroup,
  RowModelType,
  SideBarDef,
} from 'ag-grid-community';
import { PaginationOption } from '../../post-login.modal';
import { Params } from '@angular/router';
import { PostLoginService } from '../../post-login.service';
import * as alasql from 'alasql';

@Component({
  selector: 'app-leads-per-community',
  templateUrl: './leads-per-community.component.html',
  styleUrls: ['./leads-per-community.component.scss'],
})
export class LeadsPerCommunityComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private ele: ElementRef,
    private postLoginService: PostLoginService
  ) {}

  serchArrd = [];
  public rowModelType: RowModelType = 'serverSide';
  public isExpanded: boolean = false;
  statusBar: any;
  isrowSelected: boolean = false;
  totalRows: number;
  rowIndex: number;
  selectedNodes = [];
  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  public gridApi!: GridApi | any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
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

  columnDef: any = [
    {
      headerName: 'Benchmark comparison',
      field: 'benchmarkComparison',
      sortable: true,
      lockPinned: true,
      headerClass: 'padding-left-19',
      cellRenderer: function (params: Params) {
        if (params.value === 'Above') {
          return `<div class="comparison-text green-text">${params.value}</div>`;
        } else if (params.value === 'Below') {
          return `<div class="comparison-text red-text">${params.value}</div>`;
        } else {
          return `<div class="comparison-text orange-text">${params.value}</div>`;
        }
      },
    },

    {
      headerName: '4-month LPC average',
      field: 'lpcAverage',
      sortable: true,
      lockPinned: true,
      width: 170,
      filter: 'agNumberColumnFilter',
    },

    {
      headerName: 'Account owner',
      field: 'owner',
      sortable: true,
      lockPinned: true,
      width: 200,
    },
  ];

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
  };

  public autoGroupColumnDef: ColDef = {
    field: 'client_frenchiseName',
    headerCheckboxSelection: true,
    headerName: 'Client/franchise name',
    sortable: true,
    width: 350,
    pinned: 'left',
    lockPinned: true,
    cellStyle: {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      display: 'block',
      'padding-top': '4px',
    },
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        if (!params.data.children) return params.data.client_frenchiseName;
        else
          return `${params.data.client_frenchiseName} (${params.data.children.length})`;
      },
    },
  };

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.children;
  };
  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.client_frenchiseName;
  };

  rowData!: any[];

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

  ngOnInit(): void {}

  ngAfterViewInit() {
    const nextButtons = document.querySelector(
      '.ag-paging-button .ag-icon-next'
    );
    nextButtons.addEventListener(
      'click',
      this.onPaginationButtonClicked.bind(this)
    );
  }

  onRowExpanded(event: any) {
    if (event.expanded) {
      this.expandedRows.add(event.node.key);
    } else {
      this.expandedRows.delete(event.node.key);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.postLoginService.getTableData().subscribe((data) => {
      let uniqueCountColumnNames = Object.keys(data[0].uniqueCount);
      let totalActiveColumnNames = Object.keys(data[0].totalActive);
      let lastMonth;
      const uniqueCountColumns = uniqueCountColumnNames.map((column, index) => {
        const monthAbbreviation = column.substring(0, 3);
        const year = column.substring(3);
        const monthTitleCase =
          monthAbbreviation.charAt(0).toUpperCase() +
          monthAbbreviation.slice(1);
        const resultString = `${monthTitleCase}-${year}`;

        return {
          headerName: `${resultString}`,
          field: `uniqueCount.${column}`,
          cellRenderer: (params) => {
            if (params.data.uniqueCount[column] === 'inactive') {
              return '<img class="cell-image" src="/assets/images/dash.svg" >';
            } else if (params.data.uniqueCount[column] === 'right') {
              return '<img class="cell-image" src="/assets/images/right.svg" >';
            } else if (params.data.uniqueCount[column] === 'wrong') {
              return '<img class="cell-image cell-wrong" src="/assets/images/wrong.svg" >';
            } else {
              return params.data.uniqueCount[column];
            }
          },
          filter: 'agNumberColumnFilter',
          width: 80,
          resizable: true,
        };
      });

      const totalActiveColumns = totalActiveColumnNames.map((column, i) => {
        const monthAbbreviation = column.substring(0, 3);
        const year = column.substring(3);
        const monthTitleCase =
          monthAbbreviation.charAt(0).toUpperCase() +
          monthAbbreviation.slice(1);
        const monthYearCol = `${monthTitleCase}-${year}`;

        if (i === 0) {
          lastMonth = monthYearCol;
        }

        return {
          headerName: `${monthYearCol}`,
          field: `totalActive.${column}`,
          cellRenderer: (params) => {
            if (params.data.totalActive[column] === 'inactive') {
              return '<img class="cell-image" src="/assets/images/dash.svg" >';
            } else if (params.data.totalActive[column] === 'right') {
              return '<img class="cell-image" src="/assets/images/right.svg" >';
            } else if (params.data.totalActive[column] === 'wrong') {
              return '<img class="cell-image cell-wrong" src="/assets/images/wrong.svg" >';
            } else {
              return params.data.totalActive[column];
            }
          },
          filter: 'agNumberColumnFilter',
          width: 80,
          resizable: true,
        };
      });

      const modifiedColumnDefs = [
        ...this.columnDef.slice(0, 2),
        {
          headerName: 'Unique SQL count',
          sortable: false,
          children: [...uniqueCountColumns],
          lockPinned: true,
        },
        {
          headerName: 'Total active franchises',
          sortable: false,
          children: [...totalActiveColumns],
          lockPinned: true,
        },
        {
          headerName: `Status as of ${lastMonth}`,
          field: 'status',
          sortable: true,
          width: 200,
          minWidth: 100,
          resizable: true,
          filter: 'agTextColumnFilter',
          lockPinned: true,
        },
        ...this.columnDef.slice(2),
      ];

      this.columnDef = modifiedColumnDefs;
      this.totalRows = this.gridApi.paginationGetPageSize();

      let fakeServer = FakeServer(data, this.expandedRows, this.gridData);
      let datasource = getServerSideDatasource(fakeServer);
      this.gridApi.setServerSideDatasource(datasource);
    });
  }

  getMonthValue(data: any, type: string, month: string) {
    const monthData = data[type].find((item) => Object.keys(item)[0] === month);
    return monthData ? monthData[month] : 0;
  }

  onSearch() {
    this.rowIndex = null;
    setTimeout(() => {
      let term = (
        document.getElementById('filter-text-box') as HTMLInputElement
      ).value.toLowerCase();
      this.postLoginService.getSearchedData(term).subscribe((data) => {
        data.forEach(item =>{
          item.children = item.children.filter(child => this.postLoginService.checkPropertyValue(child,term))
        })
        this.handleSearchAndExpansion(data, term);
        let fakeServer = FakeServer(data, this.expandedRows, this.gridData);
        var datasource = getServerSideDatasource(fakeServer);
        this.gridApi.setServerSideDatasource(datasource);
      });
    }, 1000);
  }

  onPaginationButtonClicked() {
    let term = (document.getElementById('filter-text-box') as HTMLInputElement)
      .value;
    if (term) {
      this.postLoginService.getSearchedData(term).subscribe((data) => {
        this.handleSearchAndExpansion(data, term);
      });
    }
  }

  handleSearchAndExpansion(data, term) {
    let serchArr = false;
    setTimeout(() => {
      data.forEach((item) => {
        const searchTerm = term.toLowerCase();
        serchArr = this.postLoginService.checkPropertyValue(
          item.children,
          searchTerm
        );
        if (serchArr) {
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

  onItemsPerPageChange(newPageSize: any) {
    this.rowIndex = null;
    if (newPageSize === 'all') {
      this.gridApi.paginationSetPageSize(Number.MAX_SAFE_INTEGER);
    } else {
      this.gridApi.paginationSetPageSize(Number(newPageSize));
    }
    this.totalRows = this.gridApi.paginationGetPageSize();
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
  let childMatched = false;
  let termArray = []
  return {
    getData: function (request) {
      const hasFilter =
        request.filterModel && Object.keys(request.filterModel).length;
      var results = executeQuery(request, hasFilter);
      
      if (hasFilter) {
        results = recursiveFilter(request, results);   
                
        termArray.push(filterItem.filter);
        let searchTerms = Array.from(new Set(termArray));
        results.forEach(item =>{
          searchTerms.forEach(term=>{
            if(item.children){
              item.children = item.children.filter(child => checkPropertyValue(child,term));
            }
          })
        })

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
        setTimeout(() => {
          results.forEach((item) => {
            let searchTerm = filterItem.filter;
            childMatched = checkPropertyValue(item.children, searchTerm);
            if (childMatched) {
              matchedRowNodes.forEach((node: any) => {
                if (item.client_frenchiseName === node.key) {
                  node.setExpanded(true);
                }
              });
            }
          });
        }, 100);
      }   

      return {
        success: true,
        rows: results,
        lastRow: getLastRowIndex(request),
      };
    },

    getEmployees: function () {
      var sql =
        'SELECT DISTINCT dataPath FROM ? WHERE children = FALSE ORDER BY dataPath ASC';

      return alasql(sql, [processedData]).map((row) =>
        row.dataPath ? row.dataPath.split(',') : null
      );
    },
  };

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
      if(typeof term === 'string'){
        return value.toLowerCase().includes(term.toLowerCase());
      }
      else{
        return value.toLowerCase().includes(term);
      }
    } else if (typeof value === 'number') {
      return value === +term;
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
          key = 'dataPath';
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

    let data = alasql(sql, [processedData, allResults])
    let resultData = data.filter(item => searchObject(item,filterItem.filter))
    return resultData;
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
