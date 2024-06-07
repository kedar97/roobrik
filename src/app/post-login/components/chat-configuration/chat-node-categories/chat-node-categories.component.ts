import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GridOptions } from 'ag-grid-community';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-chat-node-categories',
  templateUrl: './chat-node-categories.component.html',
  styleUrls: ['./chat-node-categories.component.scss']
})
export class ChatNodeCategoriesComponent {
  @ViewChild(TableComponent) sharedAgGrid: TableComponent;
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
  
  defaultColDef : ColDef = {
    filter:true,
    floatingFilter:true,
    resizable:true,
    sortable:true,
    enableRowGroup:true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  }

  columnDef : ColDef[] = [
    {
      field:'nodeName',
      headerName:'Node name',
      pinned:'left',
      lockPosition:true,
    },
    {
      field:'node_category',
      headerName:'Associated node category',
    },
    {
      field:'status',
      headerName:'Status',
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

          return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
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

          return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
        }

        return null;
      },
    },
    {
      field:'last_modified_by',
      headerName:'Last modified by',
    },   
  ];

  gridOptions : GridOptions ={
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

  public rowData: any[] = [
    {
      id: 1,
      nodeName : "Intro",
      node_category:'Inquiry',
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    {
      id: 2,
      nodeName : "Full name",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      id: 3,
      nodeName : "Full name -1",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 2, 4),
      last_modified_on: new Date(2019, 8, 11),
      last_modified_by:'SophiaDavis'
    },
    {
      id: 4,
      nodeName : "Full name -2",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 6, 27),
      last_modified_on: new Date(2022, 3, 20),
      last_modified_by:'LucasMiller'
    },
    {
      id: 5,
      nodeName : "Full name -3",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2019, 7, 12),
      last_modified_on: new Date(2020, 4, 13),
      last_modified_by:'OliviaClark'
    },
    {
      id: 6,
      nodeName : "Full name -4",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown'
    },
    {
      id: 7,
      nodeName : "Motivations",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 4, 15),
      last_modified_on: new Date(2020, 8, 11),
      last_modified_by:'AvaWilson'
    },
    {
      id: 8,
      nodeName : "Motivations - 1",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 8, 4),
      last_modified_on: new Date(2020, 3, 6),
      last_modified_by:'KaiLee'
    },
    {
      id: 9,
      nodeName : "Motivations -2",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 9, 13),
      last_modified_on: new Date(2021, 8, 26),
      last_modified_by:'Alice'
    },
    {
      id: 10,
      nodeName : "Motivations -3",
      node_category:'Contact preference',
      status:'Inactive',
      created_on: new Date(2020, 11, 21),
      last_modified_on: new Date(2020, 12, 27),
      last_modified_by:'John'
    },
    {
      id: 11,
      nodeName : "Motivations -4",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2021, 1, 1),
      last_modified_on: new Date(2022, 9, 4),
      last_modified_by:'Darth'
    },
    {
      id: 12,
      nodeName : "Level of care",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2021, 5, 29),
      last_modified_on: new Date(2023, 6, 23),
      last_modified_by:'JayLyn'
    },
    {
      id: 13,
      nodeName : "Level of care -1",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2021, 11, 13),
      last_modified_on: new Date(2022, 12, 17),
      last_modified_by:'BenCruz'
    },
    {
      id: 14,
      nodeName : "Level of care -2",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2022, 8, 16),
      last_modified_on: new Date(2022, 2, 7),
      last_modified_by:'Mia Roberts'
    },
    {
      id: 15,
      nodeName : "Level of care -3",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2023, 4, 6),
      last_modified_on: new Date(2023, 10, 27),
      last_modified_by:'Wilson'
    },
    {
      id: 16,
      nodeName : "Level of care -4",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2024, 1, 30),
      last_modified_on: new Date(2024, 4, 19),
      last_modified_by:'MaxKai'
    },
  ];

  constructor(private renderer: Renderer2, private ele: ElementRef){}

  ngOnInit(){}

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

    const style = this.renderer.createElement('style');
    style.innerHTML = `
      :host ::ng-deep .create-new-dropdown .k-input-inner::before {
        content: 'Create new';
      }
    `;
    this.renderer.appendChild(document.head, style);
  }

  onSelectionChange(event:any , type:string){
    if(type === 'create new' && event.value !=''){
      this.isDropDownOptionSelected = true;
    }
    if(event.value === 'Category'){
      this.isCreateFlyOutOpen = true;
    }
  }

  onSaveChanges(form:any){}

  onCreateFlyOutClose(){
    this.isCreateFlyOutOpen = false;
    this.form.reset();
    this.isDropDownOptionSelected = false;
    this.buttonDropdown.reset();
  }

  onSearch() {
    const filterValue = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.sharedAgGrid.setQuickFilter(filterValue,false);
  }
}
