import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GridOptions } from 'ag-grid-community';
import { CustomMenuEditorComponent } from '../../custom-groups/custom-menu-editor/custom-menu-editor.component';
import { PostLoginService } from 'src/app/post-login/post-login.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';

interface DropdownData {
  id: number,
  value: string
}

@Component({
  selector: 'app-chat-question-answer-client',
  templateUrl: './chat-question-answer-client.component.html',
  styleUrls: ['./chat-question-answer-client.component.scss']
})
export class ChatQuestionAnswerClientComponent {
  questionAnswerDataUrl = "assets/question-answer-data.json";
  @ViewChild(TableComponent) sharedAgGrid: TableComponent;
  @ViewChild(DropDownListComponent) buttonDropdown: DropDownListComponent;
  rowSelection: 'single' | 'multiple' = 'multiple';

  isCreateDropDownOpen : boolean = false;
  isDropDownOptionSelected : boolean = false;
  isQuestionClientFlyOutOpen : boolean = false;
  isAnswerClientFlyOutOpen : boolean = false;
  isStatusDropDownOpen : boolean = false;
  isClientDropDownOpen : boolean = false;
  isChoiceDropDownOpen : boolean = false;
  isExistingQueDropDownOpen : boolean = false;
  isCategoryDropDownOpen : boolean = false;
  isEditQuestionFlyOutOpen : boolean = false;
  isEditAnswerFlyOutOpen : boolean = false;

  flyOutHeading : string = '';

  dropdownOptions = [
    {id: 1, value:'Chat Question - Client'},
    {id: 2, value:'Chat Answer - Client'}
  ];

  defaultColDef : ColDef = {
    resizable: true,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    suppressMovable: false,
    sortable:true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  }

  columnDef : ColDef[] = [
    {
      field:'clientName',
      headerName:'Client name',
    },
    {
      field:'nodeName',
      headerName:'Node name',
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
      headerName:'Created',
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
      headerName:'Last modified',
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
      headerName:'Modified by',
    },
    {
      width: 55,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: CustomMenuEditorComponent,
      pinned: 'right',
      lockPinned: true,
      floatingFilter: false,
      filter: false,
      resizable: false,
      sortable: false
    }
  ];

  autoGroupColDef: ColDef = {
    headerName: 'Question / Answer Text',
    cellRendererParams: {
      suppressCount: false,
    },
    pinned: 'left',
    enableRowGroup: false,
    width: 450,
    valueFormatter:function(params){
      return params.value
    }
  }

  gridOptions : GridOptions = {
    getRowId: function (params: any) {
      if (params.data.group !== params.data.question_answer){
        return "leaf-" + params.data.id;
      }
      else{
        return "parent-"+params.data.id;
      }
    },

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
      const path = [row.question_answer];
      if (row.group && row.group !== row.question_answer) {
        path.unshift(row.group);
      }

      return [...path]
    }
  };

  rowData = [];

  public questionForm = new FormGroup({
    questionText : new FormControl('',Validators.required),
    visible : new FormControl(),
    nodeName : new FormControl('',Validators.required),
    category : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required),
    initialChoice : new FormControl('',Validators.required),
    client : new FormControl('',Validators.required),
    existingQue : new FormControl(),
  });

  public answerForm = new FormGroup({
    question : new FormControl('',Validators.required),
    answerText : new FormControl('',Validators.required),
    client : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required)
  });

  editQuestionForm = new FormGroup({
    question : new FormControl('',Validators.required),
    client : new FormControl(),
    visible : new FormControl(),
    nodeName : new FormControl('',Validators.required),
    category : new FormControl('',Validators.required),
    status : new FormControl('',Validators.required)
  })

  editAnswerForm = new FormGroup({
    question : new FormControl(),
    answer : new FormControl(Validators.required),
    client : new FormControl(),
    nodeName : new FormControl(),
    category : new FormControl(),
    status : new FormControl('',Validators.required)
  })

  statusList : Array<string> = [
    "Inactive",
    "Active"
  ];

  clientList : DropdownData[] = [
    {id :1 , value:'Eskaton'},
    {id :2 , value:'Cascade Living Group'},
    {id :3 , value:'Brightview Senior Living'},
    {id :4 , value:'Blake Management Group'},
  ];

  clientListCopy: DropdownData[];

  choiceList : Array<{id:number, value :string}> = [
    {id :1 , value:'Select an existing question to start from'},
    {id :2 , value:'Create a brand new question'},
  ];

  existingQuestionsList : DropdownData[] = [
    {id:1, value:'Hi! What are you looking for today?'},
    {id:2, value:'Who are you researching senior living options for today?'},
    {id:3, value:'Ok, thanks. Why do you think it might be time to consider a move to a senior living community? You can choose more than one'},
  ];

  existingQuestionsListCopy: DropdownData[] = [];

  categoryList: DropdownData[] = [
    {
      id: 1,
      value: 'Inquiry'
    },
    { 
      id: 2,
      value: 'value'
    },
    {
      id: 3,
      value: 'Phone'
    },
    {
      id: 4,
      value: 'Email'
    },
    {
      id: 5,
      value: 'Selected person'
    },
    {
      id: 6,
      value: 'Contact preference'
    },
    {
      id: 7,
      value: 'Service level'
    },
  ];

  categoryListCopy: DropdownData[]

  constructor(private renderer: Renderer2, private ele: ElementRef , private postLoginService : PostLoginService){
    postLoginService.isQuestionMasterEditable.subscribe((res: boolean) => {
      this.isEditQuestionFlyOutOpen = res;
      this.isQuestionClientFlyOutOpen = false;
      this.isAnswerClientFlyOutOpen = false;
      if (this.isEditQuestionFlyOutOpen && this.isEditAnswerFlyOutOpen == false) {
        this.isDropDownOptionSelected = false;
        this.buttonDropdown?.reset();
        this.flyOutHeading = 'Edit Question - Client';

        postLoginService.selectedQueAnswer.subscribe((data: any) => {
          if (data) {
            this.editQuestionForm.setValue({
              question: data.group,
              client: data.clientName,
              visible: data.visible ? data.visible : false,
              nodeName: data.nodeName,
              category: data.node_category,
              status: data.status
            })
          }
        })
      }
    });

    postLoginService.isAnswerMasterEditable.subscribe((res: boolean) => {
      this.isEditAnswerFlyOutOpen = res;
      this.isQuestionClientFlyOutOpen = false;
      this.isAnswerClientFlyOutOpen = false;
      if (this.isEditAnswerFlyOutOpen && this.isEditQuestionFlyOutOpen == false) {
        this.flyOutHeading = 'Edit Answer - Client';
        this.isDropDownOptionSelected = false;
        this.buttonDropdown?.reset();
        postLoginService.selectedQueAnswer.subscribe((data: any) => {
          if (data) {
            setTimeout(() => {
              this.editAnswerForm.setValue({
                question: data.group,
                answer: data.question_answer,
                client : data.clientName,
                nodeName: data.nodeName,
                category: data.node_category,
                status: data.status
              })
            }, 200)
          }
        })
      }
    });
  }

  ngOnInit(){
    this.existingQuestionsListCopy = JSON.parse(JSON.stringify(this.existingQuestionsList));
    this.categoryListCopy = JSON.parse(JSON.stringify(this.categoryList));
    this.clientListCopy = JSON.parse(JSON.stringify(this.clientList));

    this.postLoginService.getTableData(this.questionAnswerDataUrl).subscribe(data=>{
      this.rowData = data;
    });

  }

  onDropDownOpen(event:any , type: string){
    if(type === 'create new'){
      this.isCreateDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isClientDropDownOpen = false;
      this.isChoiceDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }
    else if(type === 'status'){
      this.isStatusDropDownOpen = true;
      this.isClientDropDownOpen = false;
      this.isCreateDropDownOpen = false;
      this.isChoiceDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }
    else if(type === 'client'){
      this.isClientDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false;
      this.isChoiceDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }
    else if(type === 'choice'){
      this.isChoiceDropDownOpen = true;
      this.isClientDropDownOpen = false;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }
    else if(type === 'exestingQue'){
      this.isExistingQueDropDownOpen = true;
      this.isChoiceDropDownOpen = false;
      this.isClientDropDownOpen = false;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false;
      this.isCategoryDropDownOpen = false;
    }

    else if( type === 'category'){
      this.isCategoryDropDownOpen = true;
      this.isChoiceDropDownOpen = false;
      this.isClientDropDownOpen = false;
      this.isExistingQueDropDownOpen = false;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false
    }
  }

  onDropDownClose(event:any, type: string){
    this.isCreateDropDownOpen = false;
    this.isStatusDropDownOpen = false;
    this.isClientDropDownOpen = false;
    this.isChoiceDropDownOpen = false;
    this.isExistingQueDropDownOpen = false;
    this.isCategoryDropDownOpen = false;
  }

  onSelectionChange(event:any, type:string){
    if(event.value !='' && type === 'create new'){
      this.isDropDownOptionSelected = true
      this.questionForm.reset();
      this.answerForm.reset();
    }

    if(event.value?.toLowerCase() === 'chat question - client'){
      this.isQuestionClientFlyOutOpen = true;
      this.isAnswerClientFlyOutOpen = false;
      this.isEditQuestionFlyOutOpen = false;
      this.isEditAnswerFlyOutOpen = false;
      this.flyOutHeading = 'Create New Question - Client'
    }

    if(event.value?.toLowerCase() === 'chat answer - client'){
      this.isAnswerClientFlyOutOpen = true;
      this.isQuestionClientFlyOutOpen = false;
      this.isEditQuestionFlyOutOpen = false;
      this.isEditAnswerFlyOutOpen = false;
      this.flyOutHeading = 'Create New Answer - Client'
    }

    if(type === 'choice'){
      if(event === 2){
        this.questionForm.controls.questionText.reset();
      }
    }

    if(type === 'existingQue'){
     this.questionForm.controls.questionText.setValue(event);
    }
  }

  onSaveChanges(form: any, type: string) {
    this.sharedAgGrid.onCreateNewQuestionAnswer(form,type)
  }

  onCreateFlyOutClose(){
    this.isDropDownOptionSelected = false;
    this.isCreateDropDownOpen = false;
    this.buttonDropdown.reset();
    this.isAnswerClientFlyOutOpen = false;
    this.isQuestionClientFlyOutOpen = false;
    this.questionForm.reset();
    this.answerForm.reset();
    this.postLoginService.isQuestionMasterEditable.next(false);
    this.postLoginService.isAnswerMasterEditable.next(false);
    this.editQuestionForm.reset();
    this.editAnswerForm.reset();
    this.isEditQuestionFlyOutOpen = false;
    this.isEditAnswerFlyOutOpen = false;
  }

  onSearch() {
    const filterValue = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.sharedAgGrid.setQuickFilter(filterValue,true);
  }

  handleFilter(value, dropdown: string) {
    if(dropdown === 'existingQuestions') {
      this.existingQuestionsList = this.existingQuestionsListCopy.filter(
        (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else if(dropdown === 'associatedCategory') {
      this.categoryList = this.categoryListCopy.filter(
        (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }  else if(dropdown === 'clients') {
      this.clientList = this.clientListCopy.filter(
        (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
  }

  ngOnDestroy(){
    this.onCreateFlyOutClose();
  }
}
