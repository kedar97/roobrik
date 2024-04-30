import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-menu-editor',
  templateUrl: './custom-menu-editor.component.html',
  styleUrls: ['./custom-menu-editor.component.scss']
})
export class CustomMenuEditorComponent implements ICellRendererAngularComp{

  params : any;
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  
  refresh(params: ICellRendererParams) {

    return true;
  }

  optionList = [ 
    'Edit group details',
    'Edit membership',
    'Clone'
  ];
}
