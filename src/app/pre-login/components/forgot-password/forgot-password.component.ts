import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  isError: boolean = false;
  email: any = "rushitvora@gmail.com";
  linkSent: boolean = false;
  notiClosed: boolean = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl("", Validators.email),
  });
  
  ngOnInit() {
    setInterval(() => {
      console.log(this.form.get('email')?.hasError('email'));
    },500);
  }

  submitForm() {
      this.linkSent = true;
  }

  closeNotification() {
    this.notiClosed = true;
  }
}
