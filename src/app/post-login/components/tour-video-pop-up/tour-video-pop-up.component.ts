import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { PostLoginService } from '../../post-login.service';

@Component({
  selector: 'app-tour-video-pop-up',
  templateUrl: './tour-video-pop-up.component.html',
  styleUrls: ['./tour-video-pop-up.component.scss']
})
export class TourVideoPopUpComponent {
  constructor(public dialogRef: DialogRef) {}

  onDialogClose(){
    this.dialogRef.close();
    localStorage.setItem('homePopupShow','false')
  }
}
