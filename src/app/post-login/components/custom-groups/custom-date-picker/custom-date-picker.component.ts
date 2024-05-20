import { Component } from '@angular/core';
import { Params } from '@angular/router';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements ICellEditorAngularComp {

  params : Params ;
  newDate : string;
  agInit(params: any): void {
    this.params = params;
  }

  getValue(): any {
    return this.newDate;
  }

  onDateChange(event:any){
    let columnToChange = this.params.column.colId;
    const date = new Date(event);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.newDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    ;  

    this.params.data[columnToChange] = this.newDate;
    if(columnToChange === 'deactivateDate'){
      this.params.data.membershipStatus = 'Inactive';
    }
    this.params.api.applyTransaction({ update: [this.params.data] });
    this.params.api.refreshCells();
  }
}
