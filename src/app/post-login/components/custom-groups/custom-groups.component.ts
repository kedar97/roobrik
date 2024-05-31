import { Component, ViewChild } from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { PostLoginService } from '../../post-login.service';
import { CustomMenuEditorComponent } from './custom-menu-editor/custom-menu-editor.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-custom-groups',
  templateUrl: './custom-groups.component.html',
  styleUrls: ['./custom-groups.component.scss']
})
export class CustomGroupsComponent {
  @ViewChild(TableComponent) sharedAgGrid: TableComponent;

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

  gridApi!: GridApi | any;
  rowSelection: 'single' | 'multiple' = 'multiple';
  totalRows: number;
  rowIndex: number;

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
  rowData: any = [];

  constructor(private postLoginService: PostLoginService, private router:Router) { 
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
      width: 55,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: CustomMenuEditorComponent,
      pinned: 'right',
      lockPinned: true,
      floatingFilter:false,
      filter:false,
      resizable: false,
      sortable: false,
    },
  ]
  
  ngOnInit() {
    this.isSmallDesktopScreen = window.innerWidth <= 1366;
    this.postLoginService.getTableData(this.customGroupDataUrl).subscribe(data => {
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
      });
      this.rowData = data;
    })
  }

  onSearch() {
    this.rowIndex = null;
    const filterValue = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.sharedAgGrid.setQuickFilter(filterValue,false);
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