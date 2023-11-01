import { Component, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PostLoginService } from '../../post-login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  dialogRef: DialogRef;

  constructor(
    private dialogService: DialogService,
    private postLoginService: PostLoginService
  ) {}

  public registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl('', [
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,4}$'),
    ]),
  });

  submitForm(): void {}

  clearForm(): void {
    this.registerForm.reset();
  }

  onConfirmReset(actionTemplate: TemplateRef<any>) {
    this.postLoginService.setConfirmDialogMessage(
      'Are you sure you want to change your password?'
    );
    this.dialogRef = this.dialogService.open({
      content: ConfirmDialogComponent,
      actions: actionTemplate,
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
