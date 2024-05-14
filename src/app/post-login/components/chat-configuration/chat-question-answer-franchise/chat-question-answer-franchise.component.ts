import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GridApi, GridOptions, GridReadyEvent, SideBarDef, StatusPanelDef } from 'ag-grid-community';

@Component({
  selector: 'app-chat-question-answer-franchise',
  templateUrl: './chat-question-answer-franchise.component.html',
  styleUrls: ['./chat-question-answer-franchise.component.scss']
})
export class ChatQuestionAnswerFranchiseComponent {
  @ViewChild(DropDownListComponent) buttonDropdown: DropDownListComponent;

  isCreateDropDownOpen :boolean = false;
  isDropDownOptionSelected : boolean = false;
  isQuestionFranchiseFlyOutOpen : boolean = false;
  isAnswerFranchiseFlyOutOpen : boolean = false;
  isChoiceDropDownOpen : boolean = false;
  isExistingQueDropDownOpen : boolean = false;
  isClientDropDownOpen : boolean = false;
  isStatusDropDownOpen : boolean = false;
  isCategoryDropDownOpen : boolean = false;

  flyOutHeading : string = '';

  dropdownOptions = [
    {id: 1, value:'Chat Question - Franchise'},
    {id: 2, value:'Chat Answer - Franchise'}
  ];

  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  
  defaultColDef : ColDef = {
    filter:true,
    floatingFilter:true,
    resizable:true,
    sortable:true
  }

  columnDef : ColDef[] = [
    {
      field:'que_ans_text',
      headerName:'Question / Answer Text',
      pinned:'left',
      lockPosition:true,
      filter: 'agMultiColumnFilter',
    },
    {
      field:'clientName',
      headerName:'Client name',
      filter: 'agMultiColumnFilter',
    },
    {
      field:'franchiseName',
      headerName:'Franchise name',
      filter: 'agMultiColumnFilter',
    },
    {
      field:'nodeName',
      headerName:'Node name',
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
      headerName:'Created',
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
      headerName:'Last modified',
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
      headerName:'Modified by',
      filter: 'agMultiColumnFilter',
    },
    {
      field:'',
      headerName:'Action'
    }
  ];

  gridOptions : GridOptions ={};

  public rowData: any[] = [
    {
      nodeName : "Intro",
      node_category:'Inquiry',
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith',
      clientName :'Eskaton'
    },
    {
      nodeName : "Full name",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson',
      clientName :'Cascade Living Group'
    },
    {
      nodeName : "Full name -1",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 2, 4),
      last_modified_on: new Date(2019, 8, 11),
      last_modified_by:'SophiaDavis',
      clientName :'Brightview Senior Living'
    },
    {
      nodeName : "Full name -2",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 6, 27),
      last_modified_on: new Date(2022, 3, 20),
      last_modified_by:'LucasMiller',
      clientName :'Blake Management Group'
    },
    {
      nodeName : "Full name -3",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2019, 7, 12),
      last_modified_on: new Date(2020, 4, 13),
      last_modified_by:'OliviaClark',
      clientName :'Eskaton'
    },
    {
      nodeName : "Full name -4",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown',
      clientName :'Eskaton'
    },
    {
      nodeName : "Motivations",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 4, 15),
      last_modified_on: new Date(2020, 8, 11),
      last_modified_by:'AvaWilson',
      clientName :'Cascade Living Group'
    },
    {
      nodeName : "Motivations - 1",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 8, 4),
      last_modified_on: new Date(2020, 3, 6),
      last_modified_by:'KaiLee',
      clientName :'Brightview Senior Living'
    },
    {
      nodeName : "Motivations -2",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 9, 13),
      last_modified_on: new Date(2021, 8, 26),
      last_modified_by:'Alice',
      clientName :'GreenFields'
    },
    {
      nodeName : "Motivations -3",
      node_category:'Contact preference',
      status:'Inactive',
      created_on: new Date(2020, 11, 21),
      last_modified_on: new Date(2020, 12, 27),
      last_modified_by:'John',
      clientName :'Eskaton',
    },
    {
      nodeName : "Motivations -4",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2021, 1, 1),
      last_modified_on: new Date(2022, 9, 4),
      last_modified_by:'Darth',
      clientName :'Blake Management Group'
    },
    {
      nodeName : "Level of care",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2021, 5, 29),
      last_modified_on: new Date(2023, 6, 23),
      last_modified_by:'JayLyn',
      clientName :'Cascade Living Group'
    },
    {
      nodeName : "Level of care -1",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2021, 11, 13),
      last_modified_on: new Date(2022, 12, 17),
      last_modified_by:'BenCruz',
      clientName :'Brightview Senior Living'
    },
    {
      nodeName : "Level of care -2",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2022, 8, 16),
      last_modified_on: new Date(2022, 2, 7),
      last_modified_by:'Mia Roberts',
      clientName :'GreenFields'
    },
    {
      nodeName : "Level of care -3",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2023, 4, 6),
      last_modified_on: new Date(2023, 10, 27),
      last_modified_by:'Wilson',
      clientName :'Brightview Senior Living'
    },
    {
      nodeName : "Level of care -4",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2024, 1, 30),
      last_modified_on: new Date(2024, 4, 19),
      last_modified_by:'MaxKai',
      clientName :'Cascade Living Group'
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

  public questionForm = new FormGroup({
    questionText : new FormControl('',Validators.required),
    visible : new FormControl(),
    nodeName : new FormControl('',Validators.required),
    category : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required),
    initialChoice : new FormControl('',Validators.required),
    client : new FormControl('',Validators.required),
    existingQue : new FormControl('',Validators.required),
    franchiseList : new FormControl('',Validators.required)
  });

  public answerForm = new FormGroup({
    question : new FormControl('',Validators.required),
    answerText : new FormControl('',Validators.required),
    client : new FormControl('',Validators.required),
    nodeName : new FormControl('',Validators.required),
    category : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required),
    franchiseList : new FormControl('',Validators.required)
  });

  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];

  choiceList : Array<{id:number, value :string}> = [
    {id :1 , value:'Select an existing question to start from'},
    {id :2 , value:'Create a brand new question'},
  ];

  existingQuestionsList : Array<{id:number, value :string}> = [
    {id:1, value:'Hi! What are you looking for today?'},
    {id:1, value:'Who are you researching senior living options for today?'},
    {id:1, value:'Ok, thanks. Why do you think it might be time to consider a move to a senior living community? You can choose more than one'},
  ];

  clientList : Array<{id:number, value :string}> = [
    {id :1 , value:'Eskaton'},
    {id :2 , value:'Cascade Living Group'},
    {id :3 , value:'Brightview Senior Living'},
    {id :4 , value:'Blake Management Group'},
  ];

  franchiseList = [
    'Eskaton Village Granite Bay',
    'Eskaton Village Placerville',
    'Arbor Village',
    'Brightview Randolph',
    'Brightview Catonsville',
    'Brightview Bethesda',
    'The Blake at New Braunfels',
    'The Blake at Waco',
    'The Blake at Tyler',
  ];

  categoryList = [
    'Inquiry',
    'Name',
    'Phone',
    'Email',
    'Selected person',
    ' Contact preference',
    'Service level',
  ];

  public selectedFranhises: any = [];
  constructor(private renderer: Renderer2, private ele: ElementRef){}

  ngOnInit(){}

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();
  }

  onDropDownOpen(event:any, type:string){
    if(type === 'create new'){
      this.isCreateDropDownOpen = true;
      this.isClientDropDownOpen = false;
      this.isStatusDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isChoiceDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }

    else if(type === 'choice'){
      this.isChoiceDropDownOpen = true;
      this.isCreateDropDownOpen = false
      this.isClientDropDownOpen = false;
      this.isStatusDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }

    else if(type === 'client'){
      this.isClientDropDownOpen = true;
      this.isChoiceDropDownOpen = false;
      this.isCreateDropDownOpen = false
      this.isStatusDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }

    else if(type === 'status'){
      this.isStatusDropDownOpen = true;
      this.isChoiceDropDownOpen = false;
      this.isCreateDropDownOpen = false
      this.isClientDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }

    else if(type === 'exestingQue'){
      this.isExistingQueDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isChoiceDropDownOpen = false;
      this.isCreateDropDownOpen = false
      this.isClientDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }

    else if( type === 'category'){
      this.isCategoryDropDownOpen = true;
      this.isExistingQueDropDownOpen = false;
      this.isStatusDropDownOpen = false;
      this.isChoiceDropDownOpen = false;
      this.isCreateDropDownOpen = false
      this.isClientDropDownOpen = false;
    }
  }

  onDropDownClose(event:any, type:string){
    this.isCreateDropDownOpen = false;
    this.isExistingQueDropDownOpen = false;
    this.isStatusDropDownOpen = false;
    this.isChoiceDropDownOpen = false;
    this.isClientDropDownOpen = false;
    this.isCategoryDropDownOpen = false;
  }

  onSelectionChange(event:any, type:string){
    if(event.value !='' && type === 'create new'){
      this.isDropDownOptionSelected = true;
    }

    if(type === 'create new'){
      if(event.id === 1){
        this.flyOutHeading = 'Create New Quesion - Franchise'
        this.isQuestionFranchiseFlyOutOpen = true;
        this.isAnswerFranchiseFlyOutOpen = false;
      }
      if(event.id === 2){
        this.flyOutHeading = 'Create New Answer - Franchise'
        this.isAnswerFranchiseFlyOutOpen = true;
        this.isQuestionFranchiseFlyOutOpen = false;
      }
    }

    if(type === 'choice'){
      if(event === 2){
        this.questionForm.controls.questionText.reset();
        this.questionForm.controls.existingQue.reset();
      }
    }

    if(type === 'existingQue'){
      this.questionForm.controls.questionText.setValue(event);
    }
  }

  onSaveChanges(form:any, type:string){}

  onCreateFlyOutClose(){
    this.isCreateDropDownOpen = false;
    this.isDropDownOptionSelected = false;
    this.buttonDropdown.reset();
    this.isAnswerFranchiseFlyOutOpen = false;
    this.isQuestionFranchiseFlyOutOpen = false;
    this.questionForm.reset();
    this.answerForm.reset();
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
