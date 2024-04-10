import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  displayToggle : boolean = false;
  accountList : any[] = [
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    },
    {
      clientName :'Senior Living 1',
      subText :'A monthly look at Roobrik product performance metrics'
    }
  ]
  constructor(
    private dialogService: DialogService,
    public dailogRef: DialogRef
  ) {}
  
  ngOnInit(): void {}

}
