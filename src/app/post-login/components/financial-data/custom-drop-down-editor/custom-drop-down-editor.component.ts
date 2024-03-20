import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-drop-down-editor',
  templateUrl: './custom-drop-down-editor.component.html',
  styleUrls: ['./custom-drop-down-editor.component.scss']
})
export class CustomDropDownEditorComponent implements ICellEditorAngularComp{

  columnToChange = '' ;
  selectedValue = '';
  isTextBoxDisplay : boolean = false;
  textBoxValue = '';
  constructor(private router : Router){};
  franchiseListCopy :Array<{ name: string, id: number }> = [];
  public franchiseList:Array<{ name: string, id: number }> = [
    {
      id: 1,
      name: 'Franchise 1'
    },
    {
      id: 2,
      name: 'Franchise 2'
    },
    {
      id: 3,
      name: 'Franchise 3'
    },
    {
      id: 4,
      name: 'Franchise 4'
    },
  ];

  params : Params;
  onInputTimeout: any;

  ngOnInit(){
    this.franchiseListCopy = JSON.parse(JSON.stringify(this.franchiseList));
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
    return this.selectedValue || this.textBoxValue;
  }

  handleFilter(value) {
    this.franchiseList = this.franchiseListCopy.filter(
      (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onValueChange(event:any): void {
    if(event === 'Add franchise manually'){
      this.isTextBoxDisplay = true;  
    }
    else{
      this.selectedValue = event;
      if(this.columnToChange === 'client_frenchiseName'){
        let dataSelected= this.franchiseList.find(el=>el.id===event)
        this.params.data[this.columnToChange] = [this.params.node.parent.key,dataSelected.name];
      }
      else if(this.columnToChange === 'invoicing_entity'){
        console.log(event,this.params.data.invoicing_entity);
       let dataSelected= this.franchiseList.find(el=>el.id===event)
       
        this.params.data.invoicing_entity = dataSelected.name;
      }
      else{
        let dataSelected= this.franchiseList.find(el=>el.id===event)
        this.params.data.legal_entity = dataSelected.name;

      }

      this.params.api.applyTransaction({ update: [this.params.data] });
      this.params.api.refreshCells();
    }
  }

  onInput(){
    if (this.onInputTimeout) {
      clearTimeout(this.onInputTimeout);
    }
  
    this.textBoxValue = (document.querySelector('.textBox') as HTMLInputElement).value;
    this.onInputTimeout = setTimeout(() => {
      if (this.columnToChange === 'client_frenchiseName') {
        this.params.data[this.columnToChange] = [this.params.node.parent.key, this.textBoxValue];
      } else {
        this.params.data[this.columnToChange] = this.textBoxValue;
      }
      this.params.api.applyTransaction({ update: [this.params.data] });
      this.params.api.refreshCells();
    }, 1000);
  }
}
