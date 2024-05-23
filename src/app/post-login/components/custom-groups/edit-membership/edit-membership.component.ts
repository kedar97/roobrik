import { Component, ElementRef, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import {ColDef, GridOptions , GridApi, GridReadyEvent, RowModelType, SideBarDef } from 'ag-grid-community';
import { PaginationOption } from 'src/app/post-login/post-login.modal';
import { CustomDatePickerComponent } from '../custom-date-picker/custom-date-picker.component';
import { parentListData } from '../listData';
import { Observable, of } from 'rxjs';
import { CanComponentDeactivate } from '../../financial-data/edit-saas-revenue/unsaved-changes.guard';
import { DatePipe } from '@angular/common';
import { PostLoginService } from 'src/app/post-login/post-login.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-edit-membership',
  templateUrl: './edit-membership.component.html',
  styleUrls: ['./edit-membership.component.scss'],
  providers:[DatePipe],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        height: '0px',
        padding: '0px'
      })),
      state('*', style({
        opacity: 1,
        height: '*',
        padding: '*'
      })),
      transition('void <=> *', [
        animate('300ms ease-in-out')
      ]),
    ])
  ]
})
export class EditMembershipComponent implements CanComponentDeactivate {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef
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

  isDeactivatePopup : boolean = false;

  changesUnSaved: boolean = false;
  public checkedKeys: any[] = [];
  public childCheckedKeys :any[] =[];
  public key = 'text';
  isListDisabled : boolean = true;
  public tooltipShowDelay = 0;

  parentListData = parentListData;

  public selectedData:any = [{text:'Select all',items:[]}];
  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

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

  defaultColDef : ColDef = {
    resizable:true,
    sortable:true,
    floatingFilter:true,
    filter:'agMultiColumnFilter',
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  };

  gridOptions : GridOptions = {
    getRowId : function(params:any){
      return params.data.group + params.data.client_franchiseName;
    },
    getDataPath: function (row: any) {
      const path = [row.client_franchiseName];
      if (row.group && row.group !== row.client_franchiseName) {
        path.unshift(row.group);
      }

      return [...path]
    }
  };

  columnDef : ColDef[] = [
    {
      field:'effectiveDate',
      headerName:'Effective Date',
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
      headerName:'Deactivated Date',
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
      field:'membershipStatus',
      headerName:'Membership Status'
    }
  ];

  autoGroupColDef: ColDef = {
    headerCheckboxSelection:true,
    checkboxSelection:true,
    headerName: 'Client(s) / Franchise(s)',
    cellRendererParams: {
      suppressCount: false,
    },
    pinned: 'left',
    filter: 'agTextColumnFilter',
    width: 450,
  };

  rowData = [];

  groupName : string = '';
  groupStatus : string = '';
  groupData : any;
  selectedRowCount : number = 0;
  today : Date;
  private dialogRef: DialogRef;

  constructor(private datePipe: DatePipe,private router: Router, private renderer: Renderer2,private ele: ElementRef,private dialogService: DialogService,private postloginService : PostLoginService){
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.groupData = navigation.extras.state.linkData[0];
      this.groupName = this.groupData?.display_name;
      this.groupStatus = this.groupData?.status;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.changesUnSaved) {
      const dialogRef: DialogRef = this.dialogService.open({
        title: 'Confirmation',
        content: 'You have unsafe changes. Are you sure you want to leave this page without saving?',
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

  ngOnInit(){
    this.today = new Date();
  }

  onGridReady(params : GridReadyEvent){
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();
    this.rowData =  this.groupData?.clientFranchiseData;
  }

  onDeactivate(){
    this.isDeactivatePopup = true;
  }

  onDateChange(event:any){
    this.today = event;
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
          this.gridApi?.setRowData(this.rowData);

          this.selectedData[0].items.forEach((client,index)=>{
            const convertedArray = this.processItems(client,client.text);
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

  processItems(client:any, parentText:string) {
    const result = [];
    result.push(
      {
        group:client.text,
        client_franchiseName:client.text,
        effectiveDate : this.groupData?.effectiveDate ? this.groupData?.effectiveDate : this.datePipe.transform(new Date(), 'MM/dd/yyyy') ,
        deactivateDate : this.groupData?.deactivateDate,
        membershipStatus : 'Active'
      }
    )
    client.items.forEach((item,index) => {
      result.push({
        group: parentText,
        client_franchiseName: item.text,
        effectiveDate : this.groupData?.effectiveDate ? this.groupData?.effectiveDate : this.datePipe.transform(new Date(), 'MM/dd/yyyy'),
        deactivateDate : this.groupData?.deactivateDate,
        membershipStatus : 'Active'
      });
    });
    return result;
  }

  onPopupClose(){
    this.dialogRef.close();
  }

  onCloseDeactivatePopup(){
    this.isDeactivatePopup = false;
  }

  onDeactivateData(){
    this.isDeactivatePopup = false;
    this.changesUnSaved = true;
    this.gridApi.deselectAll();
  }

  onSearch() {    
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
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

  hasSelectAll(keys: string[]): boolean {
    return keys.includes('Select all');
  }

  onSelectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedNodes();
    this.selectedRowCount = selectedRows.length;

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
