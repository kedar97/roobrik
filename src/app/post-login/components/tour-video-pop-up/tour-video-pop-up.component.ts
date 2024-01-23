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
  constructor(public dialogRef: DialogRef,private sanitizer: DomSanitizer,private postLoginServie : PostLoginService) {}

  iframeSrc=this.sanitizer.bypassSecurityTrustResourceUrl('https://player.vimeo.com/video/302706764?h=fa08057428&title=0&byline=0&portrait=0');

  onDialogClose(){
    this.dialogRef.close();
    localStorage.setItem('homePopupShow','false')
  }
}
