import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  clientList: any[] = [
    {
      imgSrc: 'assets/images/arrow-senior-living-logo.png',
      clientName: 'Arrow Senior Living Arrow senior living',
    },
    {
      imgSrc: 'assets/images/galloway-senior-living-logo.png',
      clientName: 'Galloway Senior Living',
    },
    {
      imgSrc: 'assets/images/sunrise-logo.svg',
      clientName: 'Sunrise Senior Living',
    },
    {
      imgSrc: 'assets/images/arrow-senior-living-logo.png',
      clientName: 'Arrow Senior Living',
    },
    {
      imgSrc: 'assets/images/galloway-senior-living-logo.png',
      clientName: 'Galloway Senior Living',
    },
    {
      imgSrc: 'assets/images/sunrise-logo.svg',
      clientName: 'Sunrise Senior Living',
    },
  ];
  constructor(
    private dialogService: DialogService,
    public dailogRef: DialogRef
  ) {}
  ngOnInit(): void {}

  // closeDailog() {}
}
