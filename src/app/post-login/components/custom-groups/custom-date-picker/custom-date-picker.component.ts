import { Component } from '@angular/core';
import { Params, Router } from '@angular/router';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements ICellEditorAngularComp {

  params : Params ;
  newDate : string;
  columnToChange : string  = '';
  shouldDisableDates : boolean = false;
  constructor(private router : Router){}
  
  agInit(params: any): void {
    this.params = params;
    this.columnToChange = this.params.column.colId;

    if(this.router.url.includes('custom-groups/edit-membership')){
      this.shouldDisableDates = true;
    }
    else{
      this.shouldDisableDates = false;
    }
  }

  getValue(): any {
    if(this.newDate){
      return this.newDate;
    }
    else{
      return this.params.data[this.columnToChange]
    }
  }

  disableDates = (date: Date) => {
    if(typeof this.params.data[this.columnToChange] === 'string'){
      const dateObject = new Date(this.params.data[this.columnToChange])
      return date < dateObject;
    }
    else{
      return date < this.params.data[this.columnToChange];
    }
  };

  onDateChange(event:any){
    this.columnToChange = this.params.column.colId;
    const date = new Date(event);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.newDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`; 

    this.params.data[this.columnToChange] = this.newDate;
    let childNodes = this.params.node.childrenMapped;
    const franchises = Object.keys(childNodes).map((key) => ({
      value: childNodes[key],
    }));

    franchises.forEach(child =>{
      child.value.data[this.columnToChange] = this.newDate;
    })
    
    if(this.columnToChange === 'deactivateDate'){
      this.params.data.membershipStatus = 'Inactive';

      franchises.forEach(child =>{
        child.value.data.membershipStatus = 'Inactive';
      })
    }
    
    this.params.api.applyTransaction({ update: [this.params.data] });
    this.params.api.refreshCells();
  }
}
