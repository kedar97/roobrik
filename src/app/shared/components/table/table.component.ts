import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { ColDef, GetDataPath, GridApi, GridReadyEvent, ICellRendererParams, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from 'src/app/post-login/post-login.modal';
import { get } from 'lodash-es';
import { PostLoginService } from 'src/app/post-login/post-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  groupedRows: string[] = [];
  public isExpanded: boolean = false;

  @Input() rowHeight = undefined;
  @Input() headerHeight = undefined;

  @Input() public columnDefs: ColDef[] = [];
  @Input() public hierarchyColumnDef?: ColDef;
  @Input() public rowData = [];
  @Input() public gridOptions = undefined;
  @Input() treeData : boolean = false;

  @Input() public getDataPath: GetDataPath | undefined;
  @Input() getRowStyle = undefined;
  @Input() enableCharts : boolean = false;
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';

  yearToAdd : number;
  statusColIndex : number;
  summaryRowName = 'Saas Revenue Summary';
  pinnedTopRowData = [];
  addColumnPopUp : boolean = false;

  selectedValue = 100;
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

  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  totalRows: number;
  rowIndex: number;
  selectedNodes = [];
  
  public defaultColDef: ColDef = {
    filter: 'agMultiColumnFilter',
    floatingFilter: true,
    resizable: true,
    sortable:true,
    enableRowGroup:true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
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

  constructor(private renderer: Renderer2,private ele: ElementRef, private postLoginService : PostLoginService,private router : Router){this.setQuickFilter = this.setQuickFilter.bind(this);};

  ngOnInit(){}

  customCurrencyFormatter(params: ICellRendererParams): string {
    let value = params.value;
    if(value != null || value != undefined){
      value = +value;
      return '$' + value?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return value;
  }

  onGridReady(params:GridReadyEvent){
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();
    this.totalRows = 0;
    this.totalRows = this.gridApi.paginationGetPageSize() > this.rowData?.length ? this.rowData.length : this.gridApi.paginationGetPageSize();

    this.gridOptions.getDataPath = (row: any) => {
      const path = [row.client_frenchiseName];
      if (row.group && row.group !== row.client_frenchiseName) {
        path.unshift(row.group);
      }
      const groupedValues = this.groupedRows.map((key) => {
        const v = get(row, [key]);
        if (typeof v === 'object') {
          if (Array.isArray(v)) {
            return v.join(', ');
          } else {
            return JSON.stringify(v);
          }
        }
        if (key === 'created_on' || key === 'last_modified_on') {
          const date = new Date(row[key]);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
        } 
        else {
          return v;
        }
      });
      return [...groupedValues, ...path];
    };

    this.gridOptions.onColumnRowGroupChanged = (params: any) => {
      const groupedRowsSet = new Set(this.groupedRows);

      (params.columns || []).forEach((col: any) => {
        const colId = col.getColId();
        if (col.rowGroupActive === true) {
          groupedRowsSet.add(colId);
        } else {
          groupedRowsSet.delete(colId);
        }
      });
      this.groupedRows = Array.from(groupedRowsSet);
      this.gridApi.refreshClientSideRowModel('group');

      if(this.groupedRows.length === 0){
        this.onResetColumns();
      }
    };

    this.gridOptions.onFilterChanged = this.onFilterChanged.bind(this);
  }

  setQuickFilter(filterValue: string,isNestedRows:boolean,pinnedData?:any): void {
    const self = this;
    this.gridApi.setQuickFilter(filterValue);  
    if(isNestedRows === true){
      if(filterValue === ''){
        this.gridApi.setQuickFilter(filterValue);  
      }
      else{
        this.gridApi.forEachNode(node => node.setExpanded(false));
      }
    }
    else{
      this.gridApi.setQuickFilter(filterValue);  
    }
  }

  onFilterChanged(event:any){ 
    const self = this;  
    let filterModel = event.api.getFilterModel();
    let allNodes = [];
    let parentNodes = [];
    this.gridApi.forEachNodeAfterFilter(node => {
      allNodes.push(node);
    });

    if(event.source === 'columnFilter'){
      allNodes.forEach(node =>{
        if(filterModel && Object.keys(filterModel).length > 0){
          Object.keys(filterModel).forEach(function (key){
            let filterItem = filterModel[key]; 
            if (key === 'ag-Grid-AutoColumn') {
              key = 'client_frenchiseName';
              filterItem.filterModels.forEach(fm =>{
                if(fm != null){
                  let flag = self.postLoginService.checkPropertyValue(node.data[key],fm.filter);
                  if(flag == true && node.parent.key != null){
                    parentNodes.push(node.parent.key)
                  }
                }
              })
            }
            else{
              let flag = self.postLoginService.checkPropertyValue(node.data[key].toString(),filterItem.filter);
              if(flag == true && node.parent.key != null){
                parentNodes.push(node.parent.key)
              }
            }
          })
        }
        else{
          this.gridApi.forEachNode(node => node.setExpanded(false));
        }
      })

      parentNodes.forEach(parent =>{
        allNodes.forEach(rowNode=>{
          if(rowNode.key === parent){
            rowNode.setExpanded(true);
          }
        })
      })
    }
  }

  onExport(){
    const params = {
      processCellCallback: (cell) => {
        const value = cell.value;
        if (value === 'inactive' || value ==='right' || value === 'wrong') {
          return '';
        }
        return value;
      }
    };
    this.gridApi.exportDataAsExcel(params);
  }

  onCloseColumnPopUp(){
    this.addColumnPopUp = false;
  }

  onAddColumnClick(pinnedData){
    this.pinnedTopRowData = pinnedData;
    this.addColumnPopUp = true;
    let columnArray = this.gridApi.getColumnDefs()
    this.statusColIndex = columnArray.findIndex(column => column.colId === 'status');
    let lastYearColumn = columnArray[this.statusColIndex-1];
    this.yearToAdd = (parseInt(lastYearColumn.headerName.match(/\d+/)[0]) + 1);
  }

  onAddYearColumn(){
    let currentTableData = [];   
    const nodeData = this.gridApi.rowModel.nodeManager.allNodesMap;
    const mapped = Object.keys(nodeData).map((key)=> ({ value: nodeData[key]}));
    mapped.forEach(node=>{
      if(node.value.data.group !== this.summaryRowName){
        currentTableData.push(node.value.data)
      }
    });
  
    currentTableData = this.postLoginService.getSortedData(currentTableData)
    this.addColumnPopUp = false;

    let months = Object.keys(currentTableData[0][`revenue${this.yearToAdd -1}`]);
    const revenueYears = this.postLoginService.extractYears(currentTableData);
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

    currentTableData.forEach(item => {
        this.pinnedTopRowData[0].children.forEach((child,index) => {
          child.clientId = this.pinnedTopRowData[0].clientId + index + 1;
          if(child.client_frenchiseName === 'MRR'){
            child[`totalRevenue${this.yearToAdd}`] = 0;
          }
          if (!child[`revenue${this.yearToAdd}`]) {
            child[`revenue${this.yearToAdd}`] = {};
          }
          for (const month of Object.keys(item[`revenue${this.yearToAdd}`])) {
            if (!child[`revenue${this.yearToAdd}`][month]) {
              child[`revenue${this.yearToAdd}`][month] = 0;
            }
          }
        })
    })

     // SET VALUE FOR MRR REVENUE MONTH
     currentTableData.forEach(item =>{
      this.pinnedTopRowData[0].children.forEach(child => {
          if(item.group === item.client_frenchiseName){
            for (const month of Object.keys(item[`revenue${this.yearToAdd}`])) {
              if(child.client_frenchiseName === 'MRR'){
                child[`revenue${this.yearToAdd}`][month] += item[`revenue${this.yearToAdd}`][month];
              }
            }
          }
      })
    })
    
    // SET VALUE FOR MRR TOTAL REVENUE YEAR
    this.pinnedTopRowData[0].children.forEach(child =>{
      if(child.client_frenchiseName === 'MRR'){
          for (const month of Object.keys(child[`revenue${this.yearToAdd}`])) {
            child[`totalRevenue${this.yearToAdd}`] = child[`revenue${this.yearToAdd}`][month] != null ? child[`totalRevenue${this.yearToAdd}`] + (child[`revenue${this.yearToAdd}`][month]) : null;
          }
      } 
    })

    //SET ARR REVENUE MOTNH VALUE (MRR * 12)
    let mrrIndex = this.pinnedTopRowData[0].children.findIndex(item => item.client_frenchiseName === 'MRR');
    this.pinnedTopRowData[0].children.forEach(child =>{
        for (const month of Object.keys(child[`revenue${this.yearToAdd}`])) {
          if(child.client_frenchiseName === 'ARR'){
            child[`revenue${this.yearToAdd}`][month] = this.pinnedTopRowData[0].children[mrrIndex][`revenue${this.yearToAdd}`][month] * 12;
          }
        }
    })

    let flatSummary = this.postLoginService.flattenData(this.pinnedTopRowData,revenueYears)
    currentTableData.unshift(...flatSummary,...flatSummary[0].children);
    let flatData = this.postLoginService.flattenData(currentTableData,revenueYears)
    this.rowData = flatData;

    const modifiedColumnDefs = [
      ...this.columnDefs.slice(0,this.statusColIndex),
      {
        field:'',
        headerName:`${this.yearToAdd} total revenue`,
        marryChildren: true,
        children: [
          { field:`totalRevenue${this.yearToAdd}`, headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter', headerClass: 'hide-header-name', suppressFillHandle:true, valueFormatter: this.customCurrencyFormatter,
          },
          { field: `revenue${this.yearToAdd}_jan`, headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_feb`, headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_mar`, headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_apr`, headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_may`, headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_jun`, headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_jul`, headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_aug`, headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_sep`, headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_oct`, headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_nov`, headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
          { field: `revenue${this.yearToAdd}_dec`, headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter },
        ]
      },
      ...this.columnDefs.slice(this.statusColIndex),
    ];

    this.columnDefs = modifiedColumnDefs;     
    this.gridApi.setColumnDefs(modifiedColumnDefs);
  }

  onPaginationChange(event:any){
    this.rowIndex = null;
  }

  onItemsPerPageChange(newPageSize: any) {
    this.rowIndex = null;
    if (newPageSize === 'all') {
      this.gridApi.paginationSetPageSize(Number.MAX_SAFE_INTEGER);
      const nodeData = this.gridApi.rowModel.rowsToDisplay;
      const mapped = Object.keys(nodeData).map((key)=> ({ value: nodeData[key]}));
      this.totalRows = mapped.length;
    } else {
      this.gridApi.paginationSetPageSize(Number(newPageSize));
      this.totalRows = this.gridApi.paginationGetPageSize();
    }
    
  }

  onSelectionChanged(event:any){
    if (event.source === 'uiSelectAll') {
      const rowNodes = event.api.rowModel.rowsToDisplay;
      const matchedRowNodes = Object.entries(rowNodes)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => value);
      this.isExpanded = !this.isExpanded;
      this.totalRows = this.isExpanded ? this.rowData.length : this.gridApi.paginationGetPageSize();
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
