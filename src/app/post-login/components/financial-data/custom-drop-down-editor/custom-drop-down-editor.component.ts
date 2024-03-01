import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-custom-drop-down-editor',
  templateUrl: './custom-drop-down-editor.component.html',
  styleUrls: ['./custom-drop-down-editor.component.scss']
})
export class CustomDropDownEditorComponent implements ICellEditorAngularComp{

  selectedValue = '';

  public franchiseList: Array<string> = [
    "Franchise 1",
    "Franchise 2",
    "Franchise 3",
    "Franchise 4",
  ];

  params;

  agInit(params: any): void {
    this.params = params;
  }

  getValue(): any {
    return this.selectedValue;
  }

  onValueChange(event:any): void {
    this.selectedValue = event;
    this.params.data.client_frenchiseName = [this.params.node.parent.key,event];
    this.params.api.applyTransaction({ update: [this.params.data] });
    this.params.api.refreshCells();
  }
}
