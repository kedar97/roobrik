import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-drop-down-editor',
  templateUrl: './custom-drop-down-editor.component.html',
  styleUrls: ['./custom-drop-down-editor.component.scss']
})
export class CustomDropDownEditorComponent implements ICellEditorAngularComp{

  columnToChange ;
  selectedValue = '';
  isTextBoxDisplay : boolean = false;
  textBoxValue = '';
  constructor(private router : Router){}
  public franchiseList: Array<string> = [
    "Franchise 1",
    "Franchise 2",
    "Franchise 3",
    "Franchise 4",
  ];

  params;

  ngOnInit(){
    if(this.router.url.includes('new-client')){
      this.franchiseList.unshift('Add franchise manually')
    }
  }

  agInit(params: any): void {
    this.params = params;

    if(params.column.colDef.colId === 'ag-Grid-AutoColumn'){
      this.columnToChange = 'client_frenchiseName'
    }else{
      this.columnToChange = params.column.colDef.field;
    }
  }

  getValue(): any {
    return this.selectedValue;
  }

  onValueChange(event:any): void {
    if(event === 'Add franchise manually'){
      this.isTextBoxDisplay = true;  
    }
    else{
      this.selectedValue = event;
      if(this.columnToChange === 'client_frenchiseName'){
        this.params.data[this.columnToChange] = [this.params.node.parent.key,event];
      }
      else if(this.columnToChange === 'invoicing_entity'){
        this.params.data.invoicing_entity = event;
      }
      else{
        this.params.data.legal_entity = event;
      }

      this.params.api.applyTransaction({ update: [this.params.data] });
      this.params.api.refreshCells();
    }
  }

  onInput(){
    this.textBoxValue = (document.querySelector('.textBox') as HTMLInputElement).value;
    setTimeout(()=>{
      if(this.columnToChange === 'client_frenchiseName'){
        this.params.data[this.columnToChange] = [this.params.node.parent.key,this.textBoxValue];
      }
      else if(this.columnToChange === 'invoicing_entity'){
        this.params.data.invoicing_entity = this.textBoxValue;
      }
      else{
        this.params.data.legal_entity = this.textBoxValue;
      }
      this.params.api.applyTransaction({ update: [this.params.data] });
      this.params.api.refreshCells();
    },1000)  
  }
}
