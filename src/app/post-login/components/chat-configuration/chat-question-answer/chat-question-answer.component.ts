import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GetDataPath, GridApi, GridOptions, GridReadyEvent, SideBarDef, StatusPanelDef } from 'ag-grid-community';
import { CustomMenuEditorComponent } from '../../custom-groups/custom-menu-editor/custom-menu-editor.component';

@Component({
  selector: 'app-chat-question-answer',
  templateUrl: './chat-question-answer.component.html',
  styleUrls: ['./chat-question-answer.component.scss']
})
export class ChatQuestionAnswerComponent {
  @ViewChild(DropDownListComponent) buttonDropdown: DropDownListComponent;

  isCreateDropDownOpen : boolean = false;
  isDropDownOptionSelected : boolean = false;
  isCreateQuestionFlyOutOpen : boolean = false;
  isCreateAnswerFlyOutOpen : boolean = false;
  isStatusDropDownOpen : boolean = false;
  isQuestionDropDownOpen :boolean = false;
  isCategoryDropDownOpen : boolean = false;

  flyOutHeading : string = '';
  dropdownOptions = [
    { id: 1 , value:'Chat Question'},
    { id: 2 , value:'Chat Answer'},
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
      width:60,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: CustomMenuEditorComponent,
      pinned: 'right',
      lockPinned: true,
      floatingFilter:false,
      filter:false
    },
  ];
  public autoGroupColumnDef: ColDef = {
    width:450,
    headerCheckboxSelection: true,
    headerName: 'Question / Answer Text',
    filter: 'agMultiColumnFilter',
    pinned:'left',
    lockPosition:true
  };

  gridOptions : GridOptions ={};

  public rowData: any[] = [
    { question_answer:['Hi! What are you looking for today?'],
      nodeName : "Intro",
      node_category:'Inquiry',
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    { question_answer:['Hi! What are you looking for today?','Pricing information'],
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    { question_answer:['Hi! What are you looking for today?','Schedule a tour'],
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    { question_answer:['Hi! What are you looking for today?','Speak with an advisor'],
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    { question_answer:['Hi! What are you looking for today?','I’m researching my options'],
      status:'Active',
      created_on: new Date(2018, 6, 10),
      last_modified_on: new Date(2019, 2, 15),
      last_modified_by:'AlexiaSmith'
    },
    {
      question_answer:['Who are you researching senior living options for today?'],
      nodeName : "Full name",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      question_answer:['Who are you researching senior living options for today?','A Parent'],
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      question_answer:['Who are you researching senior living options for today?','Myslef'],
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      question_answer:['Who are you researching senior living options for today?','My spouse or partner'],
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      question_answer:['Who are you researching senior living options for today?','Someone else'],
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      question_answer:['Who are you researching senior living options for today?','I’d like to skip these questions for now'],
      status:'Active',
      created_on: new Date(2018, 9, 19),
      last_modified_on: new Date(2020, 4, 26),
      last_modified_by:'MaxJohnson'
    },
    {
      question_answer:['Ok, thanks. Why do you think it might be time to consider a move to a senior living community? You can choose more than one.'],
      nodeName : "Full name -1",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 2, 4),
      last_modified_on: new Date(2019, 8, 11),
      last_modified_by:'SophiaDavis'
    },
    {
      question_answer:['Ok, thanks. Why do you think it might be time to consider a move to a senior living community? You can choose more than one.','Just curious about options'],
      status:'Inactive',
      created_on: new Date(2019, 2, 4),
      last_modified_on: new Date(2019, 8, 11),
      last_modified_by:'SophiaDavis'
    },
    {
      question_answer:['Ok, thanks. Why do you think it might be time to consider a move to a senior living community? You can choose more than one.','Thinking about downsizing'],
      status:'Inactive',
      created_on: new Date(2019, 2, 4),
      last_modified_on: new Date(2019, 8, 11),
      last_modified_by:'SophiaDavis'
    },
    
    {
      question_answer:['How soon are you looking to make a decision?'],
      nodeName : "Full name -2",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 6, 27),
      last_modified_on: new Date(2022, 3, 20),
      last_modified_by:'LucasMiller'
    },
    {
      question_answer:['How soon are you looking to make a decision?','Within the next month'],
      status:'Inactive',
      created_on: new Date(2019, 6, 27),
      last_modified_on: new Date(2022, 3, 20),
      last_modified_by:'LucasMiller'
    },
    {
      question_answer:['How soon are you looking to make a decision?','Within the next three month'],
      status:'Inactive',
      created_on: new Date(2019, 6, 27),
      last_modified_on: new Date(2022, 3, 20),
      last_modified_by:'LucasMiller'
    },
    {
      question_answer:['What are your preferences for accommodation size?'],
      nodeName : "Full name -3",
      node_category:'Name',
      status:'Active',
      created_on: new Date(2019, 7, 12),
      last_modified_on: new Date(2020, 4, 13),
      last_modified_by:'OliviaClark'
    },
    {
      question_answer:['What are your preferences for accommodation size?','Shared accommodation'],
      status:'Active',
      created_on: new Date(2019, 7, 12),
      last_modified_on: new Date(2020, 4, 13),
      last_modified_by:'OliviaClark'
    },
    {
      question_answer:['What industry or sector are you interested in for a franchise?'],
      nodeName : "Full name -4",
      node_category:'Name',
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown'
    },
    {
      question_answer:['What industry or sector are you interested in for a franchise?','Retail'],
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown'
    },
    {
      question_answer:['What industry or sector are you interested in for a franchise?','Education'],
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown'
    },
    {
      question_answer:['What industry or sector are you interested in for a franchise?','Halth and wellness'],
      status:'Inactive',
      created_on: new Date(2019, 12, 27),
      last_modified_on: new Date(2021, 7, 21),
      last_modified_by:'EthanBrown'
    },
    {
      question_answer:['Are you interested in a specific franchise brand or company?'],
      nodeName : "Motivations",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 4, 15),
      last_modified_on: new Date(2020, 8, 11),
      last_modified_by:'AvaWilson'
    },
    {
      question_answer:['Are you interested in a specific franchise brand or company?','No Reply'],
      status:'Active',
      created_on: new Date(2020, 4, 15),
      last_modified_on: new Date(2020, 8, 11),
      last_modified_by:'AvaWilson'
    },
    {
      question_answer:['What is your level of investment capital for a franchise opportunity?'],
      nodeName : "Motivations - 1",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 8, 4),
      last_modified_on: new Date(2020, 3, 6),
      last_modified_by:'KaiLee'
    },
    {
      question_answer:['What is your level of investment capital for a franchise opportunity?','Less than $50,000'],
      status:'Active',
      created_on: new Date(2020, 8, 4),
      last_modified_on: new Date(2020, 3, 6),
      last_modified_by:'KaiLee'
    },
    {
      question_answer:['What is your level of investment capital for a franchise opportunity?','$50,000 to $100,000'],
      status:'Active',
      created_on: new Date(2020, 8, 4),
      last_modified_on: new Date(2020, 3, 6),
      last_modified_by:'KaiLee'
    },
    {
      question_answer:['Are you interested in a single-unit franchise or a multi-unit franchise?'],
      nodeName : "Motivations -2",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2020, 9, 13),
      last_modified_on: new Date(2021, 8, 26),
      last_modified_by:'Alice'
    },
    {
      question_answer:['Are you interested in a single-unit franchise or a multi-unit franchise?','Yes'],
      status:'Active',
      created_on: new Date(2020, 9, 13),
      last_modified_on: new Date(2021, 8, 26),
      last_modified_by:'Alice'
    },
    {
      question_answer:['Are you interested in a single-unit franchise or a multi-unit franchise?','No'],
      status:'Active',
      created_on: new Date(2020, 9, 13),
      last_modified_on: new Date(2021, 8, 26),
      last_modified_by:'Alice'
    },
    { 
      question_answer:['What geographic location or region are you considering'],
      nodeName : "Motivations -3",
      node_category:'Contact preference',
      status:'Inactive',
      created_on: new Date(2020, 11, 21),
      last_modified_on: new Date(2020, 12, 27),
      last_modified_by:'John'
    },
    { 
      question_answer:['What geographic location or region are you considering','Local area (city or town)'],
      status:'Inactive',
      created_on: new Date(2020, 11, 21),
      last_modified_on: new Date(2020, 12, 27),
      last_modified_by:'John'
    },
    { 
      question_answer:['What geographic location or region are you considering','State or province'],
      status:'Inactive',
      created_on: new Date(2020, 11, 21),
      last_modified_on: new Date(2020, 12, 27),
      last_modified_by:'John'
    },
    {
      question_answer:['What level of support are you seeking from a franchise company?'],
      nodeName : "Motivations -4",
      node_category:'Contact preference',
      status:'Active',
      created_on: new Date(2021, 1, 1),
      last_modified_on: new Date(2022, 9, 4),
      last_modified_by:'Darth'
    },
    {
      question_answer:['What level of support are you seeking from a franchise company?','No Reply'],
      status:'Active',
      created_on: new Date(2021, 1, 1),
      last_modified_on: new Date(2022, 9, 4),
      last_modified_by:'Darth'
    },
    {
      question_answer:['What motivated you to consider purchasing a franchise?'],
      nodeName : "Level of care",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2021, 5, 29),
      last_modified_on: new Date(2023, 6, 23),
      last_modified_by:'JayLyn'
    },
    {
      question_answer:['What motivated you to consider purchasing a franchise?','Attracted to proven business model'],
      status:'Active',
      created_on: new Date(2021, 5, 29),
      last_modified_on: new Date(2023, 6, 23),
      last_modified_by:'JayLyn'
    },
    {
      question_answer:['What motivated you to consider purchasing a franchise?','Interest in a specific industry or brand'],
      status:'Active',
      created_on: new Date(2021, 5, 29),
      last_modified_on: new Date(2023, 6, 23),
      last_modified_by:'JayLyn'
    },
    {
      question_answer:['What is your level of experience in the industry or business ownership?'],
      nodeName : "Level of care -1",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2021, 11, 13),
      last_modified_on: new Date(2022, 12, 17),
      last_modified_by:'BenCruz'
    },
    {
      question_answer:['What is your level of experience in the industry or business ownership?','Extensive experience'],
      status:'Inactive',
      created_on: new Date(2021, 11, 13),
      last_modified_on: new Date(2022, 12, 17),
      last_modified_by:'BenCruz'
    },
    {
      question_answer:['Are you interested in a franchise resale opportunity?'],
      nodeName : "Level of care -2",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2022, 8, 16),
      last_modified_on: new Date(2022, 2, 7),
      last_modified_by:'Mia Roberts'
    },
    {
      question_answer:['Are you interested in a franchise resale opportunity?','No Reply'],
      status:'Active',
      created_on: new Date(2022, 8, 16),
      last_modified_on: new Date(2022, 2, 7),
      last_modified_by:'Mia Roberts'
    },
    
    {
      question_answer:['What type of support are you looking for from the franchisor?'],
      nodeName : "Level of care -3",
      node_category:'Service level',
      status:'Active',
      created_on: new Date(2023, 4, 6),
      last_modified_on: new Date(2023, 10, 27),
      last_modified_by:'Wilson'
    },
    {
      question_answer:['What type of support are you looking for from the franchisor?','Comprehensive support'],
      status:'Active',
      created_on: new Date(2023, 4, 6),
      last_modified_on: new Date(2023, 10, 27),
      last_modified_by:'Wilson'
    },
    {
      question_answer:['What type of support are you looking for from the franchisor?','Guidance and recommendations'],
      status:'Active',
      created_on: new Date(2023, 4, 6),
      last_modified_on: new Date(2023, 10, 27),
      last_modified_by:'Wilson'
    },
    {
      question_answer:['How important is ongoing innovation and adaptation to market trends?'],
      nodeName : "Level of care -4",
      node_category:'Service level',
      status:'Inactive',
      created_on: new Date(2024, 1, 30),
      last_modified_on: new Date(2024, 4, 19),
      last_modified_by:'MaxKai'
    },
    {
      question_answer:['How important is ongoing innovation and adaptation to market trends?','Extremely important,'],
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

  public questionForm = new FormGroup({
    questionText : new FormControl('',Validators.required),
    visible : new FormControl(),
    nodeName : new FormControl(),
    category : new FormControl(),
    status : new FormControl('',Validators.required)
  });

  public answerForm = new FormGroup({
    question : new FormControl('',Validators.required),
    answerText : new FormControl('',Validators.required),
    nodeName : new FormControl('',Validators.required),
    category : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required)
  });

  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];

  questionList : Array<any> = [
    {id : 1, value:'Hi! What are you looking for today?'},
    {id : 2, value:'Who are you researching senior living options for today?'},
    {id : 3, value:'Ok, thanks. Why do you think it might be time to consider a move to a senior living community?'}
  ]

  categoryList = [
    'Inquiry',
    'Name',
    'Phone',
    'Email',
    'Selected person',
    'Contact preference',
    'Service level',
  ];

  constructor(private renderer: Renderer2, private ele: ElementRef){}

  ngOnInit(){}

  public getDataPath: GetDataPath = (data: any) => {
    return data.question_answer;
  };

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();
  }

  onDropDownOpen(event:any , type : string){
    if(type === 'create new'){
      this.isCreateDropDownOpen = true;
      this.isQuestionDropDownOpen = false;
      this.isStatusDropDownOpen = false;
    }
    else if(type === 'status'){
      this.isStatusDropDownOpen = true;
      this.isQuestionDropDownOpen = false;
      this.isCreateDropDownOpen = false;
    }
    else if(type === 'question'){
      this.isQuestionDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false;
    }
    else if( type === 'category'){
      this.isCategoryDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false
    }
  }

  onDropDownClose(event:any , type : string){
    this.isCreateDropDownOpen = false;
    this.isStatusDropDownOpen = false;
    this.isQuestionDropDownOpen = false;
    this.isCategoryDropDownOpen = false;
  }

  onSelectionChange(event:any , type : string){
    if(event.value !='' && type === 'create new'){
      this.isDropDownOptionSelected = true
    }

    if(event.value.toLowerCase() === 'chat question'){
      this.isCreateQuestionFlyOutOpen = true;
      this.flyOutHeading = 'Create New Question'
    }
    else if(event.value.toLowerCase() === 'chat answer'){
      this.isCreateAnswerFlyOutOpen = true;
      this.isCreateQuestionFlyOutOpen = false;
      this.flyOutHeading = 'Create New Answer';
    }
  }

  onSaveChanges(form:any, type: string){
    if(type === 'question'){}
  }

  onCreateFlyOutClose(){
    this.isCreateQuestionFlyOutOpen = false;
    this.questionForm.reset();
    this.isCreateAnswerFlyOutOpen = false;
    this.answerForm.reset();
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
