import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GridApi, GridOptions, GridReadyEvent, SideBarDef, StatusPanelDef } from 'ag-grid-community';
import { questionAnswerData } from '../chat-configuration-data';
import { get } from 'lodash-es';
import { CustomMenuEditorComponent } from '../../custom-groups/custom-menu-editor/custom-menu-editor.component';
import { PostLoginService } from 'src/app/post-login/post-login.service';

@Component({
  selector: 'app-chat-question-answer-client',
  templateUrl: './chat-question-answer-client.component.html',
  styleUrls: ['./chat-question-answer-client.component.scss']
})
export class ChatQuestionAnswerClientComponent {
  @ViewChild(DropDownListComponent) buttonDropdown: DropDownListComponent;
  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
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
  
  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  groupedRows: string[] = [];

  defaultColDef : ColDef = {
    resizable: true,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    suppressMovable: false
  }

  columnDef : ColDef[] = [
    {
      field:'clientName',
      headerName:'Client name',
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
      width: 60,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      cellRenderer: CustomMenuEditorComponent,
      pinned: 'right',
      lockPinned: true,
      floatingFilter: false,
      filter: false
    },
  ];

  autoGroupColDef: ColDef = {
    headerName: 'Question / Answer Text',
    cellRendererParams: {
      suppressCount: false,
    },
    pinned: 'left',
    enableRowGroup: false,
    filter: 'agMultiColumnFilter',
    width: 450,
    valueFormatter:function(params){
      return params.value
    }
  }

  gridOptions : GridOptions = {
    getRowId: function (params: any) {
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

    getDataPath: function (row: any) {
      const path = [row.question_answer];
      if (row.group && row.group !== row.question_answer) {
        path.unshift(row.group);
      }

      return [...path]
    }
  };

  rowData = questionAnswerData;

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
  });

  public answerForm = new FormGroup({
    question : new FormControl('',Validators.required),
    answerText : new FormControl('',Validators.required),
    client : new FormControl('',Validators.required),
    nodeName : new FormControl('',Validators.required),
    category : new FormControl('',Validators.required),
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

  clientList : Array<{id:number, value :string}> = [
    {id :1 , value:'Eskaton'},
    {id :2 , value:'Cascade Living Group'},
    {id :3 , value:'Brightview Senior Living'},
    {id :4 , value:'Blake Management Group'},
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

  categoryList = [
    'Inquiry',
    'Name',
    'Phone',
    'Email',
    'Selected person',
    'Contact preference',
    'Service level',
  ];

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

  ngOnInit(){}

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.gridOptions.getDataPath = (row: any) => {
      const path = [row.question_answer];
      if (row.group && row.group !== row.question_answer) {
        path.unshift(row.group);
      }
      const groupedValues = this.groupedRows.map((key) => {
        const v = get(row, [key]);
        if (typeof v === 'object') {
          if (key === 'created_on' || key === 'last_modified_on') {
            const date = new Date(row[key]);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${day.toString().padStart(2, '0')}/${month
              .toString()
              .padStart(2, '0')}/${year}`;
            }
        }  else {
          return v;
        }
      });
      return [...groupedValues, ...path];
    };

    this.gridOptions.onColumnRowGroupChanged = (params: any) => {
      const groupedRowsSet = new Set(this.groupedRows);

      (params.columns || []).forEach((col: any) => {
        const colId = col.getColId();
        if (col.rowGroupActive === true) {
          groupedRowsSet.add(colId);
        } else {
          groupedRowsSet.delete(colId);
        }
      });
      this.groupedRows = Array.from(groupedRowsSet);
      this.gridApi.refreshClientSideRowModel('group');
    };
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

  onSaveChanges(form:any, type :string){}

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

  ngOnDestroy(){
    this.onCreateFlyOutClose();
  }
}
