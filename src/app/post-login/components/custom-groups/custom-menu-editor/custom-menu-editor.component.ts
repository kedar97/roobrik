import { Component } from '@angular/core';
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
  constructor(private postLoginService : PostLoginService){
    postLoginService.selectedOption.subscribe(data =>{
      this.selectedOption = data;
    })
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  
  refresh(params: ICellRendererParams) {
    return true;
  }

  optionList = [ 
    { id: 1, name: 'Edit group details' },
    { id: 2, name: 'Edit membership' },
    { id: 3, name: 'Clone' }
  ];

  onOptionSelected(event:any){
    if (event === 1) {
      this.selectedRowData = this.params.data;
      this.postLoginService.selectedOption.next(event)
      this.postLoginService.isCustomGroupDetailEditable.next(true);
      this.postLoginService.selectedGroupData.next(this.selectedRowData);
    }
  }
}
