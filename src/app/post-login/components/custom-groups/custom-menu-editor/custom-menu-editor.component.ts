import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { PostLoginService } from 'src/app/post-login/post-login.service';

@Component({
  selector: 'app-custom-menu-editor',
  templateUrl: './custom-menu-editor.component.html',
  styleUrls: ['./custom-menu-editor.component.scss']
})
export class CustomMenuEditorComponent implements ICellRendererAngularComp{

  params : any;
  selectedRowData : any;
  selectedOption:number = 0;
  selectedQueAnswer : any;

  isChatMenu : boolean = false;
  optionList = [ 
    { id: 1, name: 'Edit group details' },
    { id: 2, name: 'Edit membership' },
    { id: 3, name: 'Clone' }
  ];

  constructor(private postLoginService : PostLoginService, private router : Router){
    if(router.url.includes('chat-configuration')){
      this.isChatMenu = true;
      this.optionList = [ 
        { id: 1, name: 'Edit question' },
        { id: 2, name: 'Edit answer' },
        { id: 3, name: 'Delete' }
      ];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  
  refresh(params: ICellRendererParams) {
    return true;
  }

  onOptionSelected(event:any){
    let gridColumns = this.params.columnApi.columnModel.gridColumns;
    let isGroupped = false;
    gridColumns.forEach(col =>{
      if(col.rowGroupActive === true){
        isGroupped = true;
      }
    })

    if(isGroupped){
      return;
    }
    else{
      if (event === 1 && !this.isChatMenu) {
        this.selectedRowData = this.params.data;
        this.postLoginService.isCustomGroupDetailEditable.next(true);
        this.postLoginService.selectedGroupData.next(this.selectedRowData);
      }
  
      else if(this.isChatMenu){
        if(event === 1){
          this.selectedQueAnswer = this.params.data;
          this.postLoginService.isAnswerMasterEditable.next(false);
          this.postLoginService.isQuestionMasterEditable.next(true);
        }
  
        else if(event === 2){
          this.postLoginService.isQuestionMasterEditable.next(false);
          this.postLoginService.isAnswerMasterEditable.next(true);
          this.selectedQueAnswer = this.params.node.parent?.data;
          this.selectedQueAnswer.id = this.params.data.id;
          this.selectedQueAnswer.question_answer = this.params.data.question_answer;
        }
        this.postLoginService.selectedQueAnswer.next(this.selectedQueAnswer);
      }
    }
  }

  onMenuDropdownOpen(){

    if(this.isChatMenu && this.params.node.parent.key === null){
      this.optionList = this.optionList.filter(option => option.id !== 2);
    }
    else if(this.isChatMenu && this.params.node.key != null){
      this.optionList = this.optionList.filter(option => option.id !== 1);
    }
   
    this.selectedOption = 0;
  }
}
