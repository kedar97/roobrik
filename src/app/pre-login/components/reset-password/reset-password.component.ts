import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidatorsList } from '../../pre-login.modal';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  saved: boolean = false;
  notiClosed: boolean = false;

  validatorsList: ValidatorsList[] = [
    {
      status: undefined,
      name: '8 characters',
    },
    {
      status: undefined,
      name: 'Contains a number',
    },
    {
      status: undefined,
      name: 'Contains a lowercase character',
    },
    {
      status: undefined,
      name: 'Contains an uppercase character',
    },
    {
      status: undefined,
      name: 'Contains a special character !@#$%^&*',
    },
    {
      status: undefined,
      name: 'Password match',
    },
  ];

  public resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(),
    confirmPassword: new FormControl(),
  });

  ngOnInit() {
    const passwordControl = this.resetPasswordForm.get('password');

    this.resetPasswordForm
      .get('password')
      ?.valueChanges.subscribe((password) => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialCharacters = /[!@#$%^&*]/.test(password);

        password.length >= 8
          ? (this.validatorsList[0].status = true)
          : (this.validatorsList[0].status = false);
        hasNumbers
          ? (this.validatorsList[1].status = true)
          : (this.validatorsList[1].status = false);
        hasLowercase
          ? (this.validatorsList[2].status = true)
          : (this.validatorsList[2].status = false);
        hasUppercase
          ? (this.validatorsList[3].status = true)
          : (this.validatorsList[3].status = false);
        hasSpecialCharacters
          ? (this.validatorsList[4].status = true)
          : (this.validatorsList[4].status = false);
        password === this.resetPasswordForm.get('confirmPassword')?.value
          ? (this.validatorsList[5].status = true)
          : (this.validatorsList[5].status = false);
      });

    this.resetPasswordForm
      .get('confirmPassword')
      ?.valueChanges.subscribe((confirmPassword) => {
        confirmPassword === this.resetPasswordForm.get('password')?.value
          ? (this.validatorsList[5].status = true)
          : (this.validatorsList[5].status = false);
      });
  }

  passwordToggle(confirmPassword: boolean) {
    if (confirmPassword) {
      this.showConfirmPassword = !this.showConfirmPassword;
    } else {
      this.showPassword = !this.showPassword;
    }
  }

  submitForm() {
    this.validatorsList.some((obj) => obj.status !== true)
      ? (this.saved = false)
      : (this.saved = true);
  }

  closeNotification() {
    this.notiClosed = true
  }
}
