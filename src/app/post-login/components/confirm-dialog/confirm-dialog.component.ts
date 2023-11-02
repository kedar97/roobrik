import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { PostLoginService } from '../../post-login.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  dailogTitle = 'Confirmation';
  dailogMessage = 'Are you sure you want to change your password?';

  constructor(public dailogRef: DialogRef, public postLoginService: PostLoginService) {}
  ngOnInit(): void {}
  
  getMessage(): string {
    return this.postLoginService.getConfirmDialogMessage();
  }
}
