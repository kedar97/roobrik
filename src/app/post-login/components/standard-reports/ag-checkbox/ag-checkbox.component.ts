import { Component } from '@angular/core';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-checkbox',
  templateUrl: './ag-checkbox.component.html',
  styleUrls: ['./ag-checkbox.component.scss']
})
export class AgCheckboxComponent {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  refresh(params: any): boolean {
    params.data.amount++;
    params.data.cbox = params.value
    console.log(params.value);
    params.api.refreshCells(params);
    return false;
  }
}
