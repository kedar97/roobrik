import { Component, ElementRef, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { parentListData } from '../listData';
import { DatePipe } from '@angular/common';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ColDef, SideBarDef, GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import { PaginationOption } from 'src/app/post-login/post-login.modal';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-group',
  templateUrl: './create-new-group.component.html',
  styleUrls: ['./create-new-group.component.scss'],
  providers: [DatePipe]
})
export class CreateNewGroupComponent {
  @ViewChild('clientDropdown') clientDropdown: DropDownListComponent;
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

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
  rowSelection: 'single' | 'multiple' = 'multiple';
  totalRows: number;
  rowIndex: number;
  selectedNodes = [];
  changesUnSaved: boolean = false;

  pageTitle = 'Create new group';

  isGroupDropDownOpen: boolean = false;
  isClientDropDownOpen : boolean = false
  isFranchiseDropDownOpen : boolean = false;
  isShowSelectClient : boolean = false;
  toggleText : string = 'Active';
  selectionHeading : string = 'Client/franchise Selection';
  parentListHeading : string = 'Client/franchise list';
  childListHeading : string = 'Selected Client/franchise';
  isParentList : boolean = false;
  isChildList : boolean = false;
  today : string;
  isGroupOptionSelected : boolean = false;
  isClientOptionSelected : boolean = false;
  isListDisabled : boolean = true;
  public checkedKeys: any[] = [];
  public childCheckedKeys :any[] =[];
  public key = 'text';

  parentListData = parentListData;

  public selectedData:any = [{text:'Select all',items:[]}];
  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

  groupTypeList = [
    { id: null, value: 'Select...' },
    { id:1, value:"Configuration & Reporting"},
    { id:2, value:"External Reporting"},
    { id:3, value:"Internal Reporting"}
  ];

  clientList = [
    {id:null,value:'Select...'}
  ];

  defaultFranchiseList = [];

  public form = new FormGroup({
    groupType : new FormControl(),
    selectedClient : new FormControl(),
    defaultFranchise : new FormControl(),
    internalName : new FormControl(),
    displayName : new FormControl(),
    excelPassword : new FormControl(),
    effectiveDate : new FormControl(),
    description :  new FormControl()
  });

  defaultColDef : ColDef ={
    resizable:true,
    filter:true,
    floatingFilter:true,
    sortable: true,
  }

  columnDef : ColDef[] =[
    {
      field:'effectiveDate',
      headerName:'Effective date',
      headerTooltip: "This date will be used to determine when  the data for each client/franchise is included in this groups reports.",
      editable:true,
      cellEditor:CustomDatePickerComponent,
      cellRenderer: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
        }
        return null;
      },

    },
    {
      field:'deactivateDate',
      headerName:'Deactivated date',
      editable:true,
      cellEditor:CustomDatePickerComponent,
    },
    {
      field:'membershipStatus',
      headerName:'Membership Status'
    }
  ];

  autoGroupColDef: ColDef = {
    headerName: 'Client(s)/Franchise(s)',
    cellRendererParams: {
      suppressCount: false,
    },
    pinned: 'left',
    filter: 'agTextColumnFilter',
    width: 450,
  };

  rowData = [];
  gridOptions : GridOptions = {
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

    getDataPath: function (row: any) {
      const path = [row.clientFranchiseName];
      if (row.group && row.group !== row.clientFranchiseName) {
        path.unshift(row.group);
      }

      return [...path]
    }
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
  
  constructor(private datePipe: DatePipe,private dialogService : DialogService,private renderer: Renderer2, private ele: ElementRef, private router: Router){}

  ngOnInit(){
    this.today = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    this.parentListData.forEach(item =>{
      if(item.items){
        item.items.forEach((client,index) =>{
          this.clientList.push({ id: index+1, value: client.text })

          if(client.items){
            client.items.forEach(child=>{
              this.defaultFranchiseList.push(child.text)
            })
          }
        })
      }
    });

    this.form.valueChanges.subscribe((newValue) => {
      this.changesUnSaved = true;
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.changesUnSaved) {
      const dialogRef: DialogRef = this.dialogService.open({
        title: 'Confirmation',
        content: 'You have unsaved changes. Are you sure you want to leave this page without saving your work?',
        actions: [
          { text: 'YES, LEAVE PAGE', primary: true ,cssClass:'ok-btn'},
          { text: 'Cancel', primary: false ,cssClass:'cancel-btn' },
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

  public itemDisabled(itemArgs: { dataItem: any; index: number }) {
    return itemArgs.dataItem.value === 'Select...';
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();
  }

  processItems(client, parentText, formValue) {
    const result = [];
    result.push(
      {
        group:client.text,
        clientFranchiseName:client.text,
        effectiveDate : formValue.effectiveDate ? formValue.effectiveDate : this.datePipe.transform(new Date(), 'MM/dd/yyyy') ,
        deactivateDate : formValue.deactivateDate,
        membershipStatus : 'Active'
      }
    )
    client.items.forEach((item,index) => {
      result.push({
        group: parentText,
        clientFranchiseName: item.text,
        effectiveDate : formValue.effectiveDate ? formValue.effectiveDate : this.datePipe.transform(new Date(), 'MM/dd/yyyy'),
        deactivateDate : formValue.deactivateDate,
        membershipStatus : 'Active'
      });
    });
    return result;
  }

  private dialogRef: DialogRef;

  onPopupClose(){
    this.dialogRef.close()
  }

  onAddClientFranchise(template: TemplateRef<unknown>){
    this.dialogRef = this.dialogService.open({
      content: template,
      appendTo: this.container,
      actions: [
        { text: "ADD TO GROUP", cssClass: ['btn', 'btn-add'] },
        { text: "CANCEL", primary: false, cssClass: ['btn', 'btn-cancel'] }
      ],
    });

    this.dialogRef.dialog.instance.dialog.nativeElement.classList.add('list-dialog');

    this.dialogRef.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
        if(this.selectedData[0].items.length){ 
          this.changesUnSaved = true;
          this.gridApi?.setRowData([]);

          this.selectedData[0].items.forEach((client,index)=>{
            const convertedArray = this.processItems(client,client.text, this.form.value);
            const transaction = { 
              add: [...convertedArray],
            };
        
            this.gridApi?.applyTransaction(transaction);
            this.gridApi?.refreshCells({ force: true });
          })
        }
      }
    });
  }

  onSave(form : any){
    this.changesUnSaved = false;
    this.router.navigate(['/reports/custom-groups']);
  }

  onCancel(){
    this.canDeactivate();
    this.form.reset();
    this.checkedKeys = [];
    this.childCheckedKeys = [];
    this.selectedData = [];
    this.isShowSelectClient = false;
    this.isGroupOptionSelected = this.isClientOptionSelected = false;
  }

  formDropDownOpen(type: string){
    switch(type){
      case 'groupType':
        this.isGroupDropDownOpen = true;
        this.isClientDropDownOpen = false;
        this.isFranchiseDropDownOpen = false;
        break;
      case 'selectClient':
        this.isClientDropDownOpen = true;
        this.isGroupDropDownOpen = false;
        this.isFranchiseDropDownOpen = false;
        break;
      case 'franchiseCount':
        this.isFranchiseDropDownOpen = true;
        this.isGroupDropDownOpen = false;
        this.isClientDropDownOpen = false;
        break;
    }
  }

  formDropDownClose(type: string){
    switch(type){
      case 'groupType':
        this.isGroupDropDownOpen = false;
        break;
      case 'selectClient':
        this.isClientDropDownOpen = false;
        break;
      case 'franchiseCount':
        this.isFranchiseDropDownOpen = false;
        break;
    }
  }

  onSelectioChange(event:any ,type:string){
    if(type !== 'client'){
      setTimeout(() => {
        if (this.clientDropdown) {
          this.clientDropdown.reset();
          this.isClientOptionSelected = false;
        }
      });
    }
    this.childCheckedKeys =[];
    this.checkedKeys = [];
    this.selectedData = [{text:'Select all', items :[]}]
    if(type === 'group'){
      this.isGroupOptionSelected = true;
      this.isShowSelectClient = event === 1 ? true : false;
      this.isListDisabled = event === 1 ? false : true;
      if(event === 1){
        this.isShowSelectClient = true;
        this.isListDisabled = false;
        this.parentListData = [];

        this.selectionHeading = 'Franchise Selection';
        this.parentListHeading = 'Franchise list';
        this.childListHeading = 'Selected Franchises';
      }
      else{
        this.checkedKeys = [];
        this.childCheckedKeys = [];
        this.isShowSelectClient = false;
        this.isListDisabled = false;
        this.parentListData = parentListData;
        this.selectionHeading = 'Client/franchise Selection';
        this.parentListHeading = 'Client/franchise list';
        this.childListHeading = 'Selected Client/fanchises';
      }
    }
    else if(type === 'client'){
      this.isClientOptionSelected = true;
      let clientName = this.clientList[event].value;
      let parentObject = parentListData.find(obj => obj.items.some(item => item.text === clientName));
      if (parentObject) {
        let desiredObject = parentObject.items.find(item => item.text === clientName);
        this.parentListData = [{text:'Select all', items:[desiredObject]}];
      }
    }
  }
  
  onAddSelected(){
    const filteredData = this.addSelectedItem(this.checkedKeys, this.parentListData);
    this.selectedData = filteredData.length ? filteredData : [{text:'Select all', items:[]}];
    this.childCheckedKeys = [];
  }

  onAddAll(){
    this.selectedData = this.parentListData;
    this.childCheckedKeys = [];
  }

  onRemoveAll(){
    this.selectedData = [];
    this.selectedData.push({text:'Select all', items:[]})
    this.childCheckedKeys = [];
    this.checkedKeys = [];
  }

  onRemoveSelected(){
    if(this.childCheckedKeys.length>0){
      const filteredData = this.removeSelectedItem(this.childCheckedKeys, this.selectedData);
      this.selectedData = filteredData;
    }
    this.childCheckedKeys = [];
  }

  addSelectedItem(texts: string[], nodes: any[]): any[] {
    const filteredData = [];
    for (const node of nodes) {
      if (texts.includes(node.text)) {
        filteredData.push(node);
      } else if (node.items) {
        const filteredItems = this.addSelectedItem(texts, node.items);
        if (filteredItems.length > 0) {
          filteredData.push({
            ...node,
            items: filteredItems
          });
        }
      }
    }
    return filteredData;
  }

  removeSelectedItem(excludedTexts: string[], nodes: any[]): any[] {
    const filteredData = [];
    for (const node of nodes) {
      if (!excludedTexts.includes(node.text)) {
        const filteredItems = node.items ? this.removeSelectedItem(excludedTexts, node.items) : [];
        filteredData.push({
          ...node,
          items: filteredItems
        });
      }
    }
    return filteredData;
  }

  getTotalItemsCount(data:any): number {
    let totalCount = 0;

    const countItems = (nodes: any[]) => {
      nodes.forEach(node => {
        totalCount++;
        if (node.items && node.items.length > 0) {
          countItems(node.items);
        }
      });
    };
    countItems(data);
    return totalCount;
  }

  onRowSelectionChanged(event: any) {
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
}
