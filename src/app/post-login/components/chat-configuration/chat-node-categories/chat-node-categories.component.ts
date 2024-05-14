import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GridApi, GridOptions, GridReadyEvent, SideBarDef, StatusPanelDef } from 'ag-grid-community';

@Component({
  selector: 'app-chat-node-categories',
  templateUrl: './chat-node-categories.component.html',
  styleUrls: ['./chat-node-categories.component.scss']
})
export class ChatNodeCategoriesComponent {

  @ViewChild(DropDownListComponent) buttonDropdown: DropDownListComponent;

  isCreateDropDownOpen : boolean = false;
  isStatusDropDownOpen : boolean = false;
  dropdownOptions = [ {id: 1, value:'Category'} ];

  isCreateFlyOutOpen : boolean = false;
  isDropDownOptionSelected : boolean = false;

  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];

  public form = new FormGroup({
    categoryName : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required),
  });

  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  
  defaultColDef : ColDef = {
    filter:true,
    floatingFilter:true,
    resizable:true,
    sortable:true,
    enableRowGroup:true
  }

  columnDef : ColDef[] = [
    {
      field:'nodeName',
      headerName:'Node name',
      pinned:'left',
      lockPosition:true,
      filter: 'agMultiColumnFilter',
    },
    {
      field:'node_category',
      headerName:'Associated node category',
      filter: 'agMultiColumnFilter',
    },
    {
      field:'status',
      headerName:'Status',
      filter: 'agMultiColumnFilter',
    },
    {
      field:'created_on',
      headerName:'Created on',
      cellRenderer: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          return `${day.toString().padStart(2, '0')}/${month
            .toString()
            .padStart(2, '0')}/${year}`;
        }

        return null;
      },
    },
    {
      field:'last_modified_on',
      headerName:'Last modified on',
      cellRenderer: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();

          return `${day.toString().padStart(2, '0')}/${month
            .toString()
            .padStart(2, '0')}/${year}`;
        }

        return null;
      },
    },
    {
      field:'last_modified_by',
      headerName:'Last modified by',
      filter: 'agMultiColumnFilter',
    },   
  ];

  gridOptions : GridOptions ={};

  public rowData: any[] = [
    {
      nodeName : "Intro",
      node_category:'Inquiry',
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    {
      nodeName : "Full name",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      nodeName : "Full name -1",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 2, 4),
      last_modified_on: new Date(2019, 8, 11),
      last_modified_by:'SophiaDavis'
    },
    {
      nodeName : "Full name -2",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 6, 27),
      last_modified_on: new Date(2022, 3, 20),
      last_modified_by:'LucasMiller'
    },
    {
      nodeName : "Full name -3",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2019, 7, 12),
      last_modified_on: new Date(2020, 4, 13),
      last_modified_by:'OliviaClark'
    },
    {
      nodeName : "Full name -4",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown'
    },
    {
      nodeName : "Motivations",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 4, 15),
      last_modified_on: new Date(2020, 8, 11),
      last_modified_by:'AvaWilson'
    },
    {
      nodeName : "Motivations - 1",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 8, 4),
      last_modified_on: new Date(2020, 3, 6),
      last_modified_by:'KaiLee'
    },
    {
      nodeName : "Motivations -2",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 9, 13),
      last_modified_on: new Date(2021, 8, 26),
      last_modified_by:'Alice'
    },
    {
      nodeName : "Motivations -3",
      node_category:'Contact preference',
      status:'Inactive',
      created_on: new Date(2020, 11, 21),
      last_modified_on: new Date(2020, 12, 27),
      last_modified_by:'John'
    },
    {
      nodeName : "Motivations -4",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2021, 1, 1),
      last_modified_on: new Date(2022, 9, 4),
      last_modified_by:'Darth'
    },
    {
      nodeName : "Level of care",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2021, 5, 29),
      last_modified_on: new Date(2023, 6, 23),
      last_modified_by:'JayLyn'
    },
    {
      nodeName : "Level of care -1",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2021, 11, 13),
      last_modified_on: new Date(2022, 12, 17),
      last_modified_by:'BenCruz'
    },
    {
      nodeName : "Level of care -2",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2022, 8, 16),
      last_modified_on: new Date(2022, 2, 7),
      last_modified_by:'Mia Roberts'
    },
    {
      nodeName : "Level of care -3",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2023, 4, 6),
      last_modified_on: new Date(2023, 10, 27),
      last_modified_by:'Wilson'
    },
    {
      nodeName : "Level of care -4",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2024, 1, 30),
      last_modified_on: new Date(2024, 4, 19),
      last_modified_by:'MaxKai'
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

  public statusBar: {statusPanels: StatusPanelDef[];} = {
    statusPanels: [
      {
        statusPanel: "agTotalRowCountComponent",
        align: "left",
      },
    ],
  };

  constructor(private renderer: Renderer2, private ele: ElementRef){}

  ngOnInit(){}

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();
  }

  onDropDownOpen(event:any,type:string){
    if(type === 'create new'){
      this.isCreateDropDownOpen = true;
    }
    else if(type === 'status'){
      this.isStatusDropDownOpen = true;
    }
  }

  onDropDownClose(event:any,type: string){
    if(type === 'create new'){
      this.isCreateDropDownOpen = false;
    } 
    else if(type === 'status'){
      this.isStatusDropDownOpen = false;
    }
  }

  onSelectionChange(event:any , type:string){
    if(type === 'create new' && event.value !=''){
      this.isDropDownOptionSelected = true;
    }
    if(event.value === 'Category'){
      this.isCreateFlyOutOpen = true;
    }
  }

  onSaveChanges(fomr:any){}

  onCreateFlyOutClose(){
    this.isCreateFlyOutOpen = false;
    this.form.reset();
    this.isDropDownOptionSelected = false;
    this.buttonDropdown.reset();
  }

  onSearch() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
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
