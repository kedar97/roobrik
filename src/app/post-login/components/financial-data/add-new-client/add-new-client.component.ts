import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColDef, GetDataPath, GridApi, GridOptions, GridReadyEvent, ICellRendererParams, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from 'src/app/post-login/post-login.modal';
import { PostLoginService } from 'src/app/post-login/post-login.service';
import { CustomDropDownEditorComponent } from '../custom-drop-down-editor/custom-drop-down-editor.component';
import { Observable } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';

interface DropdownData {
  id: number,
  name: string
}

@Component({
  selector: 'app-add-new-client',
  templateUrl: './add-new-client.component.html',
  styleUrls: ['./add-new-client.component.scss']
})


export class AddNewClientComponent {
  saasRevenueUrl: string = "assets/saas-revenue-data.json";
  undoRedoCellEditingLimit = 20;
  pageTitle : string = 'New Client';
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
  isClientDropDownOpen : boolean = false;
  isInvoicingDropDownOpen : boolean = false;
  isLegalDropDownOpen : boolean = false;
  isAddFlyOutOpen : boolean = true;
  clientDropdownTextbox : boolean = false;
  invoicingDropdownTextbox : boolean = false;
  legalDropdownTextbox : boolean = false;
  newClient;
  groupDefaultExpanded = 1;
  defaultTableData = [];
  updatedData = [];
  clientName : string ;
  currentTableData = [];    
  editedRow: any;
  isNewClientSaved: boolean = false;
  changesUnSaved: boolean = false;
  clientnameListCopy: DropdownData[];
  invoicingEntityListCopy: DropdownData[];
  legalEntityListCopy: DropdownData[];
  dropdownInputValue: number = 1;
  isUndoAvailable: number;
  isRedoAvailable: number;

  constructor(private renderer: Renderer2,private ele: ElementRef, private postLoginServie: PostLoginService,private dialogService: DialogService) {}
  
  ngOnInit() {
    this.clientnameListCopy = JSON.parse(JSON.stringify(this.clientNameList));
    this.invoicingEntityListCopy = JSON.parse(JSON.stringify(this.invoicingEntityList));
    this.legalEntityListCopy = JSON.parse(JSON.stringify(this.legalEntityList));
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.changesUnSaved) {
      const dialogRef: DialogRef = this.dialogService.open({
        title: 'Confirmation',
        content: 'You have unsaved changes. Are you sure you want to leave this page without saving?',
        actions: [
          { text: 'Cancel', primary: false ,cssClass:'cancel-btn' },
          { text: 'YES, LEAVE PAGE', primary: true ,cssClass:'ok-btn'}
        ]
      });

      return new Observable<boolean>((observer:any) => {
        dialogRef.result.subscribe((result) => {
          if (result instanceof Object && 'primary' in result) {
            observer.next(result.primary);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        });
      });
    }
    return true;
  }

  


  public form = new FormGroup({
    clientName : new FormControl('',Validators.required),
    invoicingEntity : new FormControl(),
    legalEntity : new FormControl(),
    franchiseCount : new FormControl()
  });

  clientNameList : DropdownData[] = [
    {
      id: 1,
      name: 'Add client manually'
    },
    {
      id: 2,
      name: 'Client 1'
    },
    {
      id: 3,
      name: 'Client 2'
    },
    {
      id: 4,
      name: 'Client 3'
    },
    {
      id: 5,
      name: 'Client 4'
    },
  ];

  invoicingEntityList: DropdownData[] = [
    {
      id: 1,
      name: 'Add Invoicing Entity manually'
    },
    {
      id: 2,
      name: 'Invoicing Entity 1'
    },
    {
      id: 3,
      name: 'Invoicing Entity 2'
    },
    {
      id: 4,
      name: 'Invoicing Entity 3'
    },
    {
      id: 5,
      name: 'Invoicing Entity 4'
    },
  ];

  legalEntityList: DropdownData[] = [
    {
      id: 1,
      name: 'Add Legal Entity manually'
    },
    {
      id: 2,
      name: 'Legal Entity 1'
    },
    {
      id: 3,
      name: 'Legal Entity 2'
    },
    {
      id: 4,
      name: 'Legal Entity 3'
    },
    {
      id: 5,
      name: 'Legal Entity 4'
    },
  ];

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

  customCurrencyFormatter(params: ICellRendererParams): string {
    let value = params.value;
    if(value != null || value != undefined){
      value = parseInt(value);
      return '$' + value?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    return value;
  }

  columnDef : ColDef[] | any = [
    {
      field:'invoicing_entity',
      headerName:'Invoicing entity',
      sortable:true,
      editable:this.isCellEditable,
      cellEditor:CustomDropDownEditorComponent,
    },
    {
      field:'legal_entity',
      headerName:'Legal entity',
      sortable:true,
      editable:this.isCellEditable,
      cellEditor:CustomDropDownEditorComponent,
    },
    {
      field:'',
      headerName:'2021 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2021', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true,suppressFillHandle:true, valueFormatter: this.customCurrencyFormatter
        },
        { field: 'revenue2021.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2021.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
        { field: 'revenue2021.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable,},
      ]
    },
    {
      field:'',
      headerName:'2022 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2022', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, suppressFillHandle:true, valueFormatter: this.customCurrencyFormatter,
        },
        { field: 'revenue2022.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2022.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
      ]
    },
    {
      field:'',
      headerName:'2023 total revenue',
      marryChildren: true,
      children: [
        { field:'totalRevenue2023', headerName :'Total', columnGroupShow :null,minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name', suppressFillHandle:true, valueFormatter: this.customCurrencyFormatter,
        },
        { field: 'revenue2023.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2023.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
      ]
    },
    {
      field:'',
      headerName:'2024 total revenue',
      marryChildren: true,
      openByDefault:true,
      children: [
        { field: 'totalRevenue2024', headerName :'Total', columnGroupShow :null, minWidth: 70, filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name', suppressFillHandle:true,valueFormatter: this.customCurrencyFormatter,  
        },
        { field: 'revenue2024.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter', 
        editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',   editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
        { field: 'revenue2024.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',  editable:this.isRevenueMonthEditable,valueFormatter: this.customCurrencyFormatter, },
      ]
    },    
    {
      field:'',
      headerName:'2025 total revenue',
      marryChildren: true,
      children: [
        { field: 'totalRevenue2025', headerName :'Total', columnGroupShow :null, minWidth: 70,filter: 'agNumberColumnFilter',
          headerClass: 'hide-header-name',hide:true, suppressFillHandle:true, valueFormatter: this.customCurrencyFormatter, 
        },
        { field: 'revenue2025.jan', headerName :'Jan', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.feb', headerName :'Feb', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.mar', headerName :'Mar', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.apr', headerName :'Apr', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.may', headerName :'May', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.jun', headerName :'Jun', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.jul', headerName :'Jul', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.aug', headerName :'Aug', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.sep', headerName :'Sep', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.oct', headerName :'Oct', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.nov', headerName :'Nov', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
        { field: 'revenue2025.dec', headerName :'Dec', columnGroupShow: 'open', width: 70, filter: 'agNumberColumnFilter',hide:true, valueFormatter: this.customCurrencyFormatter, editable:this.isRevenueMonthEditable, },
      ]
    },    
    {
      field:'owner',
      headerName:'Account owner',
      sortable: true,
      editable:true,
    }
  ];

  isRevenueMonthEditable(params){
    return params.node.level != 0 ? true:false;
  }

  isCellEditable(params) {
    return (params.node.level != 0) || (params.data.status === null || params.data.owner === null) && params.data.invoicing_entity === null && params.data.legal_entity === null ? true : false;
  }

  public getDataPath: GetDataPath = (data: any) => {
    return data.client_frenchiseName;
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
    isExternalFilterPresent : this.isExternalFilterPresent.bind(this),
    doesExternalFilterPass : this.doesExternalFilterPass.bind(this),
    quickFilterText : ''
  };
  
  public autoGroupColumnDef: ColDef = {
      headerName:'Client/franchise name',
      pinned:'left',
      lockPosition:true,
      sortable: true,
      width: 300,
      cellStyle: {
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        display: 'block',
        'padding-top': '4px',
      },
      suppressFillHandle:true,
      cellEditor:CustomDropDownEditorComponent,
      editable: this.isCellEditable,
  };

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultColumnState = this.gridColumnApi.getColumnState();
    this.defaultFiltersState = this.gridApi.getFilterModel();
    this.isUndoAvailable = this.gridApi.getCurrentUndoSize();
    this.isRedoAvailable = this.gridApi.getCurrentUndoSize();
    
    this.postLoginServie.getTableData(this.saasRevenueUrl).subscribe(res => {
      this.defaultTableData = res;
    })

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
          editable:true,
          filter: 'agTextColumnFilter', 
        },
        ...this.columnDef.slice(-1),
      ]

      this.columnDef = modifiedColumnDefs;      
      this.totalRows = this.gridApi.getDisplayedRowCount();
  }

  isExternalFilterPresent(): boolean {
    return true;
  }

  doesExternalFilterPass(node: any): boolean {
    const quickFilterText = this.gridOptions.quickFilterText.toLowerCase();
    const nodeData = node.allLeafChildren;
    const mapped = Object.keys(nodeData).map((key) => ({ value: nodeData[key]}));
    let newData = [];
    let flag = false;
    mapped.forEach(node=>{
      newData.push(node.value.data)
    })
    newData.forEach(item =>{
      flag = this.postLoginServie.checkPropertyValue(item,quickFilterText);
    })
    return flag;
  }

  onRowExpanded(){
    this.totalRows = this.gridApi.getDisplayedRowCount();
  }

  onFilterChanged(event:any){
    let columnToFilter = event.columns[0]?.colId;
    let filteredData = [];
    let filterTerm = this.gridApi?.getFilterModel()?.[`${columnToFilter}`]?.filter;
    if(filterTerm){
      if(typeof filterTerm === 'string' && (filterTerm.toLowerCase() === 'active' || filterTerm.toLowerCase() === 'inactive') && columnToFilter === 'status'){
        filterTerm = filterTerm.toLowerCase();
        filteredData = [];

        let parentNodes = [] ;
        const nodeData = this.gridApi.rowModel.nodeManager.allNodesMap;
        let mapped = Object.keys(nodeData).map(key => nodeData[key]).filter(node => node.rowIndex !== null)
        .map(node => ({ value: node }));
        
        this.rowData.forEach(item => {
          if(item[columnToFilter]?.toLowerCase() === filterTerm){
            filteredData.push(item);
            mapped.forEach(node => {
              if(node.value.key === item.client_frenchiseName[0]){
                parentNodes.push(node.value.data);
              }
            })
          }
        });

        let uniqueClients = {};
        let filteredParents = parentNodes.filter(item => {
        if (!uniqueClients[item.clientId]) {
          uniqueClients[item.clientId] = true;
          return true;
        }
        return false;
        });

        parentNodes = filteredParents;
        this.rowData = filteredData;
        parentNodes.forEach(parent =>{
          this.rowData.push(parent)
        })
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
          this.rowData.unshift(this.editedRow.parent.data)
          this.groupDefaultExpanded = 1;
        }
        else{
          filteredData = [];
          let revenue = columnToFilter.split('.')[0];
          let revenueMonth = columnToFilter.split('.')[1];
          this.rowData.forEach(item => {
            item[revenue][revenueMonth] = parseInt(item[revenue][revenueMonth]);
            if( item[revenue][revenueMonth] === filterTerm){
              filteredData.push(item);
            }
          })
          
          this.rowData = filteredData;
          this.rowData.unshift(this.editedRow.parent.data)
          this.groupDefaultExpanded = 1;
        }
      }
    }
    else{
      let term = (document.getElementById('filter-text-box') as HTMLInputElement).value;
      let newData = [];
      let flag = false;

      if(term){
        this.currentTableData.forEach(item => {
          flag = this.postLoginServie.searchObject(item,term);
          if(flag){
            newData.push(item);
          }
        })       
        this.rowData = newData;
      }
      else{
        this.currentTableData.forEach(obj => {
          for(let year in obj) {
            if (year.startsWith('revenue')) {
              for (let month in obj[year]) {
                if (Number.isNaN(obj[year][month])) {
                  obj[year][month] = 0;
                }
              }
            } else if (year.startsWith('totalRevenue')) {
              if (Number.isNaN(obj[year])) {
                obj[year] = 0;
              }
            }
          }
      });
        this.rowData = this.currentTableData;
      }
    }    
  }

  onSearch() {    
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
    this.groupDefaultExpanded = 1;
  }

  onAddFlyOutClose(){
    this.isAddFlyOutOpen = false;
    this.form.reset();
    this.clientDropdownTextbox = false;
  }

  onCellValueChanged(event){
    const { data } = event.node;
    this.editedRow = event.node;
    const { colDef} = event;
    let updatedColumn = event.colDef.field;
    let revenueYear:string;
    let revenueMonth : string;
    let newValue = event.newValue;

    data[updatedColumn] = newValue;
    this.updatedData = [data]; 

    this.isUndoAvailable = this.gridApi.getCurrentUndoSize();
    this.isRedoAvailable = this.gridApi.getCurrentRedoSize();

    if(event.colDef.field.includes('revenue')){
      revenueYear = updatedColumn.split('.')[0];
      revenueMonth = updatedColumn.split('.')[1];
      const year = colDef.field.match(/\d{4}/)[0];

      // GET UPDATED REVENUE MONTH AND POPULATED NEW VALUE TO REMAING MOTNHS
      const months = Object.keys(data[`revenue${year}`]);
      const changedMonthIndex = months.indexOf(revenueMonth);
      for (let i = changedMonthIndex + 1; i < months.length; i++) {
        const month = months[i];
        data[`revenue${year}`][month] = newValue!= null ? +newValue : null;
      }

      // CALCULATE TOTLA REVENUE OF MONTHS
      data[`totalRevenue${year}`] = 0;
      for (const month of Object.keys(data[`revenue${year}`])) {
        data[`totalRevenue${year}`] = data[`revenue${year}`][month] != null ? data[`totalRevenue${year}`] + (+data[`revenue${year}`][month]) : null;
      }

      this.updatedData = [data]; 

      // UPDATING PARENT VALUE
      const nodeData = this.gridApi.rowModel.nodeManager.allNodesMap;
      let mapped = Object.keys(nodeData).map(key => nodeData[key]).filter(node => node.rowIndex !== null)
      .map(node => ({ value: node }));

      let parentData = this.editedRow.parent.data;

      parentData[revenueYear][revenueMonth]= 0;
      parentData[`totalRevenue${year}`] = 0;
      for (const month of Object.keys(parentData[`revenue${year}`])) {
        parentData[`revenue${year}`][month] = 0;
      }

      mapped.forEach( node =>{
        parentData[`totalRevenue${year}`] += (node.value.data[`totalRevenue${year}`] == null || node.value.level === 0) ? 0 : +node.value.data[`totalRevenue${year}`];

        for (const month of Object.keys(parentData[`revenue${year}`])) {
          parentData[`revenue${year}`][month] += (node.value.data[`revenue${year}`][month] == null || node.value.level === 0) ? 0 : +node.value.data[`revenue${year}`][month] ;
        }

      })

      this.gridApi.applyServerSideTransaction({ update: this.updatedData });
      this.gridApi.refreshCells();
      this.changesUnSaved = true;
      this.rowData.push(...this.updatedData);
    }

  }

  onSaveChanges(data : any){
    let childCount = data.value.franchiseCount;
    let children =[];
    let lastNode ;
    let lastNodeData ;
    let isEmptyTable = this.gridApi.rowModel.rowsToDisplay;
    let alreadyClientExist = false;

    if(!(typeof data.value.clientName === 'string')) {
      const client = this.clientNameList.find(client => client.id === data.value.clientName);
      data.value.clientName = client ? client.name : '';
    }

    if(!(typeof data.value.invoicingEntity === 'string') && data.value.invoicingEntity != null ){
      const invoicingEntity = this.invoicingEntityList.find(entity => entity.id === data.value.invoicingEntity);
      data.value.invoicingEntity = invoicingEntity ? invoicingEntity.name : '';
    }
    else if(data.value.invoicingEntity == null){
      const invoicingEntity = data.value.clientName;
      data.value.invoicingEntity = invoicingEntity;
    }

    if(!(typeof data.value.legalEntity === 'string') && data.value.legalEntity != null ){
      const legalEntity = this.legalEntityList.find(entity => entity.id === data.value.legalEntity);
      data.value.legalEntity = legalEntity ? legalEntity.name : '';
    }
    else if(data.value.legalEntity == null){
      const legalEntity = data.value.clientName;
      data.value.legalEntity = legalEntity;
    }

    if(isEmptyTable.length === 0 ){
      lastNodeData = this.defaultTableData[this.defaultTableData.length-1];
    }

    else{
      const nodes = this.gridApi.rowModel.nodeManager.allNodesMap;
      const mapped = Object.keys(nodes).map((key) => ({value: nodes[key],}));

      mapped.forEach( node =>{
        if(data.value.clientName === node.value.data.client_frenchiseName[0]){
          alreadyClientExist = true;
        }
      })
  
      if(alreadyClientExist){
        alert('Client name already exists');
        this.onAddFlyOutClose();
        return;
      }

      lastNode = mapped[mapped.length-1];
      lastNodeData ;
      if(lastNode.value.level != 0){
        lastNodeData = lastNode.value.parent.data;
      }
      else{
        lastNodeData = lastNode.value.data;
      }
    }
    this.newClient = {
      clientId :  lastNodeData.clientId + lastNodeData.children.length + 1,
      client_frenchiseName  : [data.value.clientName],
      invoicing_entity : data.value.invoicingEntity == null ? data.value.clientName : data.value.invoicingEntity,
      legal_entity : data.value.legalEntity == null ? data.value.clientName : data.value.legalEntity,
      revenue2021: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2022: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2023: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2024: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2025: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      owner: null,
      status:null,
    }

    let temporary: boolean = false;
    if(this.clientDropdownTextbox){
      this.newClient.client_frenchiseName = [`${this.newClient.client_frenchiseName} - TEMPORARY`];
      temporary = true;
    }
    
    children = Array.from({ length: childCount }).map((_, i) => ({
      client_frenchiseName: temporary ? `[${this.form.value.clientName}] - Franchise ${i} - TEMPORARY` : `[${this.form.value.clientName}] - Franchise ${i}`,
      invoicing_entity: this.newClient.invoicing_entity,
      legal_entity: this.newClient.legal_entity,
      clientId: this.newClient.clientId + i + 1,
      revenue2021: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2022: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2023: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2024: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      revenue2025: { jan: null, feb: null, mar: null, apr: null, may: null, jun: null, jul: null, aug: null, sep: null, oct: null, nov: null, dec: null },
      owner: null,
      status:null,
    }));

    const transaction = { 
      add: [this.newClient],
    };

    this.gridApi.applyTransaction(transaction);
    this.gridApi.refreshCells({ force: true });

    this.addChildToNewClient(children);
    this.onAddFlyOutClose();
    this.totalRows = this.gridApi.getDisplayedRowCount();
    this.pageTitle = this.newClient.client_frenchiseName;
    this.isNewClientSaved = true;

    let breadcrumbItems = [{text:'Saas Revenue', title:'saas-revenue'},{text:`${this.pageTitle}`, title:`${this.pageTitle}`}];
    this.postLoginServie.breadCrumbItems.next(breadcrumbItems);
  }

  addChildToNewClient(children){
    let newClientData;
    const nodeData = this.gridApi.rowModel.nodeManager.allNodesMap;
    const mapped = Object.keys(nodeData).map((key)=> ({ value: nodeData[key]}));
    mapped.forEach(node=>{
      this.currentTableData.push(node.value.data)
    })
    mapped.forEach( node =>{
      if(node.value.key = this.newClient.client_frenchiseName){
        newClientData = node.value.data;
      }
    });

    if(!newClientData.children){
      newClientData.children=[]
    }
    
    children.forEach(child =>{
      newClientData.children.push(child)
      child.client_frenchiseName = [...newClientData.client_frenchiseName,child.client_frenchiseName];
    })

    this.currentTableData = [...this.currentTableData,...children];
    this.rowData = this.currentTableData;
    this.totalRows = this.gridApi.getDisplayedRowCount();
  }

  onClientDropDownValueChange(event: number , dropdown: string){
    if(event === 1){
      if(dropdown === 'client') {
        this.clientDropdownTextbox = true;
        this.form.get('clientName').reset();
      } else if(dropdown === 'invoicing') {
        this.invoicingDropdownTextbox = true;
        this.form.get('invoicingEntity').reset();
      } else {
        this.legalDropdownTextbox = true;
        this.form.get('legalEntity').reset();
      }
    }
  }

  formDropDownOpen(name : string){
    switch (name){
      case 'clientname':
        this.isClientDropDownOpen = true;
        this.isInvoicingDropDownOpen = false;
        this.isLegalDropDownOpen = false;
        break;

      case 'invoicingEntity':
        this.isInvoicingDropDownOpen = true;
        this.isClientDropDownOpen = false;
        this.isLegalDropDownOpen = false;
        break;

      case 'legalEntity':
        this.isLegalDropDownOpen = true;
        this.isClientDropDownOpen = false;
        this.isInvoicingDropDownOpen = false;
        break;

      default:
        break;
    }
  }

  formDropDownClose(){
    this.isClientDropDownOpen = false;
    this.isInvoicingDropDownOpen = false;
    this.isLegalDropDownOpen = false;
  }

  onUndo(){
    this.gridApi.undoCellEditing();
  }

  onRedo(){
    this.gridApi.redoCellEditing();
  }

  onAddNewRow(){
    const nodes = this.gridApi.rowModel.nodeManager.allNodesMap;
    const mapped = Object.keys(nodes).map((key) => ({value: nodes[key],}));
    let parentRow ;
    mapped.forEach(node =>{
      if(node.value.level === 0){
        parentRow = node.value.data; 
      }
    })

    const newData = {  
      client_frenchiseName:[this.pageTitle,''], 
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

  onSave(){
    this.changesUnSaved = false;
  }

  onItemsPerPageChange(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  onSelectionChanged(event: any) {
    this.selectedNodes = this.gridApi.getSelectedNodes();
    if (this.selectedNodes.length === 1) {
      this.rowIndex = this.selectedNodes[0].rowIndex;
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

  handleFilter(value, dropdown: string) {
    if(dropdown === 'client') {
      this.clientNameList = this.clientnameListCopy.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else if(dropdown === 'invoicing') {
      this.invoicingEntityList = this.invoicingEntityListCopy.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.legalEntityList = this.legalEntityListCopy.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
  }

  activateDropdown(dropdown: string) {
    if(dropdown === 'client') {
      this.clientDropdownTextbox = false;
    } else if(dropdown === 'invoicing') {
      this.invoicingDropdownTextbox = false;
    } else {
      this.legalDropdownTextbox = false;
    }
  }
}
