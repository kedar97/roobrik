import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ColDef, GetDataPath, GridApi, GridOptions, GridReadyEvent, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from 'src/app/post-login/post-login.modal';
import { PostLoginService } from 'src/app/post-login/post-login.service';
import { CanComponentDeactivate } from './unsaved-changes.guard';
import { Observable} from 'rxjs';
import { CustomDropDownEditorComponent } from '../custom-drop-down-editor/custom-drop-down-editor.component';

@Component({
  selector: 'app-edit-saas-revenue',
  templateUrl: './edit-saas-revenue.component.html',
  styleUrls: ['./edit-saas-revenue.component.scss']
})

export class EditSaasRevenueComponent implements CanComponentDeactivate {
  public undoRedoCellEditingLimit = 20;
  changesUnsaved : boolean = false;
  updatedData = [];
  defaultTableData = [];

  canDeactivate(): Observable<boolean> | boolean {
    if (this.changesUnsaved) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }

  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  rowSelection: 'single' | 'multiple' = 'multiple';
  selectedNodes = [];
  isExpanded: boolean = false;
  rowIndex: number;
  selectedValue = 100;
  rowData = [];
  totalRows :number;
  linkData :any;
  clientName : string =''

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
  
  constructor(private router: Router, private renderer: Renderer2,private ele: ElementRef, private postLoginService : PostLoginService,private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.linkData = navigation.extras.state.linkData;
      this.rowData = this.linkData;
      this.clientName = this.linkData[0].client_frenchiseName
      this.totalRows = this.rowData.length;

      //---------------- FOR TREE DATA ----------------//
      this.linkData.forEach(item=>{
        item.client_frenchiseName = [item.client_frenchiseName]
        if(item.children){
          item.children.forEach(child=>{
            child.client_frenchiseName = [item.client_frenchiseName,child.client_frenchiseName]
          })
        }
      })
      this.defaultTableData= [this.linkData[0],...this.linkData[0].children]
      this.rowData = this.defaultTableData;
    }
  }

  columnDef : ColDef[] | any = [
    {
      field:'invoicing_entity',
      headerName:'Invoicing entity',
      editable: this.isCellEditable,
      sortable:true,
    },
    {
      field:'legal_entity',
      headerName:'Legal entity',
      editable: this.isCellEditable,
      sortable:true,
    },
    {
      field:'',
      headerName:'2021 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2021', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true,suppressFillHandle:true, 
        },
        { field: 'revenue2021.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
        { field: 'revenue2021.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable},
      ]
    },
    {
      field:'',
      headerName:'2022 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2022', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, suppressFillHandle:true,
        },
        { field: 'revenue2022.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2022.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
      ]
    },
    {
      field:'',
      headerName:'2023 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2023', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name', suppressFillHandle:true,
        },
        { field: 'revenue2023.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2023.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
      ]
    },
    {
      field:'',
      headerName:'2024 total revenue',
      marryChildren: true,
      openByDefault:true,
      children: [
        { field: 'totalRevenue2024', headerName :'Total', columnGroupShow :null, minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name', suppressFillHandle:true,
        },
        { field: 'revenue2024.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', 
        editable:this.isRevenueMonthEditable},
        { field: 'revenue2024.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter' ,editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
        { field: 'revenue2024.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', editable:this.isRevenueMonthEditable },
      ]
    },    
    {
      field:'',
      headerName:'2025 total revenue',
      marryChildren: true,
      children: [
        { field: 'totalRevenue2025', headerName :'Total', columnGroupShow :null, minWidth: 70,filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, suppressFillHandle:true,
        },
        { field: 'revenue2025.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
        { field: 'revenue2025.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, editable:this.isRevenueMonthEditable },
      ]
    },    
    {
      field:'owner',
      headerName:'Account owner',
      sortable: true,
      editable: this.isCellEditable,
    }
  ];

  onFilterChanged(event:any){
    let columnToFilter = event.columns[0]?.colId;
    let filteredData = [];
    let filterTerm = this.gridApi?.getFilterModel()?.[`${columnToFilter}`]?.filter;

    if(filterTerm){
      if(typeof filterTerm === 'string' && filterTerm.toLowerCase() === 'active' && columnToFilter === 'status'){
        filterTerm = filterTerm.toLowerCase();
        filteredData = [];
        this.rowData.forEach(item => {
          if(item[columnToFilter].toLowerCase() === filterTerm){
            filteredData.push(item);
          }
        })
  
        this.rowData = filteredData;
        this.groupDefaultExpanded = 1;
      }
      else if(columnToFilter.toLowerCase().includes('revenue')){
        if(columnToFilter.includes('totalRevenue')){
          filteredData = [];
          this.rowData.forEach(item => {
            if(item[columnToFilter] === filterTerm){
              filteredData.push(item);
            }
          })
          this.rowData = filteredData;
          this.groupDefaultExpanded = 1;
        }
        else{
          filteredData = [];
          let revenue = columnToFilter.split('.')[0];
          let revenueMonth = columnToFilter.split('.')[1];
  
          this.rowData.forEach(item => {
            if(item[revenue][revenueMonth] === filterTerm){
              filteredData.push(item);
            }
          })
          this.rowData = filteredData;
          this.groupDefaultExpanded = 1;
        }
      }
    }
    else{
      this.rowData = this.defaultTableData;
    }    


    // GET PARENT VALUE
    let parentNode ;
    const nodeData = this.gridApi.rowModel.nodeManager.allNodesMap;
    const mapped = Object.keys(nodeData).map((key) => ({ value: nodeData[key]}));
    mapped.forEach(node=>{
      if(node.value.key === this.clientName){
        parentNode = node;
      }
    })

    let parentData = parentNode.value.data;
    this.rowData.unshift(parentData)
  }

  isRevenueMonthEditable(params){
    return params.data.children === undefined ? true : false;
  }

  isCellEditable(params) {
    return ((params.node.data.client_frenchiseName === '') || (params.node.data.invoicing_entity == null) || (params.node.data.legal_entity == null) || (params.node.data.owner == null) || (params.node.data.status == null) && (params.node.data.children == undefined) && params.data.children == undefined) ? true : false ;
  }

  public groupDefaultExpanded = 0;
  public getDataPath: GetDataPath = (data: any) => {
    return data.client_frenchiseName;
  };
  
  public autoGroupColumnDef: ColDef = {
      headerName:'Franchise Name',
      pinned:'left',
      lockPosition:true,
      sortable: true,
      width: 300,
      editable: this.isCellEditable,
      cellStyle: {
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        display: 'block',
        'padding-top': '4px',
      },
      suppressFillHandle:true,
      cellEditor:CustomDropDownEditorComponent
  };

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
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

  onRowExpanded(){
    this.totalRows = this.gridApi.getDisplayedRowCount();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();

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
          editable: this.isCellEditable,
          filter: 'agTextColumnFilter', 
        },
        ...this.columnDef.slice(-1),
      ]

      this.columnDef = modifiedColumnDefs;      
      this.totalRows = this.gridApi.getDisplayedRowCount();
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
    this.selectedNodes = this.gridOptions.api.getSelectedNodes();
    if (this.selectedNodes.length === 1) {
      this.rowIndex = this.selectedNodes[0].rowIndex;
    }
  }

  onSearch() {    
    let term = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    if(term === 'active'){
      term = term.toLowerCase();
      let filteredData = [];
      this.rowData.forEach(item =>{
        if(item.status?.toLowerCase() === term){
          filteredData.push(item)
        }
      })
      this.rowData = filteredData;
    }
    else if(!term){
      this.rowData = this.defaultTableData;      
    }
    else{
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
    this.groupDefaultExpanded = 1
  }

  onItemsPerPageChange(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  onCellValueChanged(event:any){
    const { data } = event.node;
    const { colDef} = event;
    let updatedColumn = event.colDef.field;
    let revenueYear:string;
    let revenueMonth : string;
    let newValue = event.newValue;

    data[updatedColumn] = newValue;
    this.updatedData = [data]; 

    if(event.colDef.field.includes('revenue')){
      revenueYear = updatedColumn.split('.')[0];
      revenueMonth = updatedColumn.split('.')[1];
      const year = colDef.field.match(/\d{4}/)[0];

      // GET UPDATED REVENUE MONTH AND POPULATED NEW VALUE TO REMAING MOTNHS
      const months = Object.keys(data[`revenue${year}`]);
      const changedMonthIndex = months.indexOf(revenueMonth);
      for (let i = changedMonthIndex + 1; i < months.length; i++) {
        const month = months[i];
        data[`revenue${year}`][month] = newValue;
      }

      // CALCULATE TOTLA REVENUE OF MONTHS
      data[`totalRevenue${year}`] = 0;
      for (const month of Object.keys(data[`revenue${year}`])) {
        data[`totalRevenue${year}`] += data[`revenue${year}`][month];
      }

      this.updatedData = [data]; 

      // UPDATING PARENT VALUE
      let parentNode ;
      const nodeData = this.gridApi.rowModel.nodeManager.allNodesMap;
      const mapped = Object.keys(nodeData).map((key) => ({ value: nodeData[key]}));
      mapped.forEach(node=>{
        if(node.value.key === this.clientName){
          parentNode = node;
        }
      })
  
      let parentData = parentNode.value.data;
      parentData[revenueYear][revenueMonth]= 0;
      parentData[`totalRevenue${year}`] = 0;
      for (const month of Object.keys(parentData[`revenue${year}`])) {
        parentData[`revenue${year}`][month] = 0;
      }

      mapped.forEach(node => {
        parentData[`totalRevenue${year}`] += node.value.data[`totalRevenue${year}`] == null ? 0 : node.value.data[`totalRevenue${year}`];

        for (const month of Object.keys(parentData[`revenue${year}`])) {
          parentData[`revenue${year}`][month] += node.value.data[`revenue${year}`][month] == null ? 0 : node.value.data[`revenue${year}`][month] ;
        }
      })
    }
    this.gridApi.applyServerSideTransaction({ update: this.updatedData });
    this.gridApi.refreshCells();
    this.changesUnsaved = true;
    this.rowData.push(...this.updatedData);
  }

  onUndo() {
    this.gridApi.undoCellEditing();
  }

  onRedo() {
    this.gridApi.redoCellEditing();
  }

  onAddNewRow(){
    let parentRow = this.gridData.api.rowModel.rowsToDisplay[0].data;
    const newData = {  
      client_frenchiseName:[this.clientName,''], 
      invoicing_entity: null, 
      legal_entity: null, 
      totalRevenue2021: null, 
      revenue2021: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2022: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2023: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2024: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2025: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      owner: null,
      status:null,
      clientId : parentRow.clientId + parentRow.children.length + 1,

    };

    if(!parentRow.children){
      parentRow.children=[]
    }

    parentRow.children.push(newData);
    const transaction = { 
      route: [parentRow.client_frenchiseName],
      add: [newData],
    };
    this.gridApi.applyTransaction(transaction);
    this.gridApi.refreshCells({ force: true });
    this.totalRows = this.gridApi.getDisplayedRowCount();
  }

  onSaveChanges(){
    this.changesUnsaved =  false;
  }
  
}
