import { Component } from '@angular/core';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-tour-video-pop-up',
  templateUrl: './tour-video-pop-up.component.html',
  styleUrls: ['./tour-video-pop-up.component.scss']
})
export class TourVideoPopUpComponent {
  constructor(public dialogRef: DialogRef, private dialogService: DialogService) {}

  onDialogClose(){
    this.dialogRef.close();
    localStorage.setItem('homePopupShow','false')

    this.dialogService.open({
      content: DialogComponent,
      cssClass:'switch-account-dialog'
    });
  }
}
