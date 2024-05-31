import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { ColDef, GridApi, GridOptions, GridReadyEvent, SideBarDef, StatusPanelDef } from 'ag-grid-community';
import { CustomMenuEditorComponent } from '../../custom-groups/custom-menu-editor/custom-menu-editor.component';
import { PostLoginService } from 'src/app/post-login/post-login.service';
import { get } from 'lodash-es';

interface DropdownData {
  id: number,
  value: string
}

@Component({
  selector: 'app-chat-question-answer',
  templateUrl: './chat-question-answer.component.html',
  styleUrls: ['./chat-question-answer.component.scss']
})

export class ChatQuestionAnswerComponent {

  questionAnswerDataUrl = "assets/question-answer-data.json";
  @ViewChild(DropDownListComponent) buttonDropdown: DropDownListComponent;
  public rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";

  isCreateDropDownOpen: boolean = false;
  isDropDownOptionSelected: boolean = false;
  isCreateQuestionFlyOutOpen: boolean = false;
  isCreateAnswerFlyOutOpen: boolean = false;
  isStatusDropDownOpen: boolean = false;
  isQuestionDropDownOpen: boolean = false;
  isCategoryDropDownOpen: boolean = false;
  isEditQuestionFlyOut: boolean = false;
  isEditAnswerFlyOut: boolean = false;

  rowSelection: 'single' | 'multiple' = 'multiple';
  flyOutHeading: string = '';
  dropdownOptions = [
    { id: 1, value: 'Chat Question' },
    { id: 2, value: 'Chat Answer' },
  ];

  defaultColumnState: any;
  defaultFiltersState: any;
  gridColumnApi: any;
  gridData: any;
  gridApi!: GridApi | any;
  groupedRows: string[] = [];

  defaultColDef: ColDef = {
    resizable: true,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    suppressMovable: false,
    sortable:true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  }

  columnDef: ColDef[] = [
    {
      field: 'nodeName',
      headerName: 'Node name',
      filter: 'agMultiColumnFilter',
    },
    {
      field: 'node_category',
      headerName: 'Associated node category',
      filter: 'agMultiColumnFilter',
    },
    {
      field: 'status',
      headerName: 'Status',
      filter: 'agMultiColumnFilter',
    },
    {
      field: 'created_on',
      headerName: 'Created',
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
      field: 'last_modified_on',
      headerName: 'Last modified',
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
      field: 'last_modified_by',
      headerName: 'Modified by',
      filter: 'agMultiColumnFilter',
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

  gridOptions: GridOptions = {
    getRowId: function (params: any) {
      if (params.data.group !== params.data.question_answer){
        return "leaf-" + params.data.id;
      }
      else{
        return "parent-"+params.data.id;
      }
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

  public statusBar: { statusPanels: StatusPanelDef[]; } = {
    statusPanels: [
      {
        statusPanel: "agTotalRowCountComponent",
        align: "left",
      },
    ],
  };

  public questionForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
    visible: new FormControl(),
    nodeName: new FormControl(),
    category: new FormControl(),
    status: new FormControl('', Validators.required)
  });

  public answerForm = new FormGroup({
    question: new FormControl('', Validators.required),
    answerText: new FormControl('', Validators.required),
    nodeName: new FormControl(),
    category: new FormControl(),
    status: new FormControl('', Validators.required)
  });

  public editQuestionForm = new FormGroup({
    question: new FormControl('', Validators.required),
    visible: new FormControl(),
    nodeName: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  public editAnswerForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
    answerText: new FormControl('', Validators.required),
    nodeName: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  statusList: Array<string> = [
    "Inactive",
    "Active"
  ];

  questionList: DropdownData[] = [
    { id: 1, value: 'Hi! What are you looking for today?' },
    { id: 2, value: 'Who are you researching senior living options for today?' },
    { id: 3, value: 'Ok, thanks. Why do you think it might be time to consider a move to a senior living community? You can choose more than one' }
  ];

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

  categoryListCopy: DropdownData[] = [];
  questionListCopy: DropdownData[] = [];

  constructor(private renderer: Renderer2, private ele: ElementRef, private postLoginService: PostLoginService) {
    postLoginService.isQuestionMasterEditable.subscribe((res: boolean) => {
      this.isEditQuestionFlyOut = res;
      this.isCreateAnswerFlyOutOpen = false;
      this.isCreateQuestionFlyOutOpen = false;
      if (this.isEditQuestionFlyOut && this.isEditAnswerFlyOut == false) {
        this.isDropDownOptionSelected = false;
        this.buttonDropdown?.reset();
        this.flyOutHeading = 'Edit Question';

        postLoginService.selectedQueAnswer.subscribe((data: any) => {
          if (data) {
            this.editQuestionForm.setValue({
              question: data.group,
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
      this.isEditAnswerFlyOut = res;
      this.isCreateAnswerFlyOutOpen = false;
      this.isCreateQuestionFlyOutOpen = false;
      if (this.isEditAnswerFlyOut && this.isEditQuestionFlyOut == false) {
        this.flyOutHeading = 'Edit Answer';
        this.isDropDownOptionSelected = false;
        this.buttonDropdown?.reset();
        postLoginService.selectedQueAnswer.subscribe((data: any) => {
          if (data) {
            setTimeout(() => {
              this.editAnswerForm.setValue({
                questionText: data.group,
                answerText: data.question_answer,
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

  ngOnInit() {
    this.categoryListCopy = JSON.parse(JSON.stringify(this.categoryList));
    this.questionListCopy = JSON.parse(JSON.stringify(this.questionList));

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridData = params;
    this.gridColumnApi = params.columnApi;
    this.defaultFiltersState = this.gridApi.getFilterModel();

    this.postLoginService.getTableData(this.questionAnswerDataUrl).subscribe(data=>{
      this.rowData = data;
    })

    this.gridOptions.getDataPath = (row: any) => {
      const path = [row.question_answer];
      if (row.group && row.group !== row.question_answer) {
        path.unshift(row.group);
      }
      const groupedValues = this.groupedRows.map((key) => {
        const v = get(row, [key]);
        if (typeof v === 'object') {
          if (Array.isArray(v)) {
            return v.join(', ');
          } else {
            return JSON.stringify(v);
          }
        }
        if (key === 'created_on' || key === 'last_modified_on') {
          const date = new Date(row[key]);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
        } 
        else {
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

  onDropDownOpen(event: any, type: string) {
    if (type === 'create new') {
      this.isCreateDropDownOpen = true;
      this.isQuestionDropDownOpen = false;
      this.isStatusDropDownOpen = false;
    }
    else if (type === 'status') {
      this.isStatusDropDownOpen = true;
      this.isQuestionDropDownOpen = false;
      this.isCreateDropDownOpen = false;
    }
    else if (type === 'question') {
      this.isQuestionDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false;
    }
    else if (type === 'category') {
      this.isCategoryDropDownOpen = true;
      this.isStatusDropDownOpen = false;
      this.isCreateDropDownOpen = false
    }
  }

  onDropDownClose(event: any, type: string) {
    this.isCreateDropDownOpen = false;
    this.isStatusDropDownOpen = false;
    this.isQuestionDropDownOpen = false;
    this.isCategoryDropDownOpen = false;
  }

  onSelectionChange(event: any, type: string) {
    this.postLoginService.isAnswerMasterEditable.next(false);
    this.postLoginService.isQuestionMasterEditable.next(false);
    if (event.value != '' && type === 'create new') {
      this.isDropDownOptionSelected = true;
      this.questionForm.reset();
      this.answerForm.reset();
    }

    if (event.id === 1) {
      this.isCreateQuestionFlyOutOpen = true;
      this.isCreateAnswerFlyOutOpen = false;
      this.flyOutHeading = 'Create New Question';
      this.isEditAnswerFlyOut = false;
      this.isEditQuestionFlyOut = false;
    }

    else if (event.id === 2) {
      this.isCreateAnswerFlyOutOpen = true;
      this.isCreateQuestionFlyOutOpen = false;
      this.flyOutHeading = 'Create New Answer';
      this.isEditAnswerFlyOut = false;
      this.isEditQuestionFlyOut = false;
    }
  }

  onSaveChanges(form: any, type: string) {
    const min = 1000000000;
    const max = 9999999999;
    const id = Math.floor(Math.random() * (max - min + 1)) + min;

    if (type === 'question') {
      const newObj = {
        id: id,
        group: form.value.questionText,
        question_answer: form.value.questionText,
        nodeName: form.value.nodeName,
        node_category: form.value.category.value,
        status: form.value.status,
        created_on: new Date().toISOString(),
        last_modified_on: new Date().toISOString(),
        last_modified_by: 'John Doe',
        visible: form.value.visible,
        clientName: "HealthCorp",
        franchiseName: ["HealthLife"]      
      }
  
      this.rowData.unshift(newObj);
      this.gridApi?.setRowData(this.rowData);
    } else if(type === 'answer') {
      const newObj = {
        id: id,
        group: form.value.question,
        question_answer: form.value.answerText,
        nodeName: form.value.nodeName,
        status: form.value.status,
        created_on: new Date().toISOString(),
        last_modified_on: new Date().toISOString(),
        last_modified_by: 'John Doe'    
      }
      this.rowData.unshift(newObj);
      this.gridApi?.setRowData(this.rowData);
    }
  }

  onCreateFlyOutClose() {
    this.isCreateQuestionFlyOutOpen = false;
    this.questionForm.reset();
    this.isCreateAnswerFlyOutOpen = false;
    this.answerForm.reset();
    this.isDropDownOptionSelected = false;
    this.buttonDropdown.reset();
    this.postLoginService.isQuestionMasterEditable.next(false);
    this.postLoginService.isAnswerMasterEditable.next(false);
    this.editQuestionForm.reset();
    this.editAnswerForm.reset();
    this.isEditQuestionFlyOut = false;
    this.isEditQuestionFlyOut = false;
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

  handleFilter(value, dropdown: string) {
    if(dropdown === 'associatedCategory') {
      this.categoryList = this.categoryListCopy.filter(
        (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else if(dropdown === 'questions') {
      this.questionList = this.questionListCopy.filter(
        (s) => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
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
