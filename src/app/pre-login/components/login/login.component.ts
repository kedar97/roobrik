import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isError:boolean = false;
  email: any = "rushitvora@gmail.com";
  password: any =  "password";
  showPassword: boolean = false;

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl("", Validators.email),
    password: new FormControl(),
  });

  submitForm() {
    if(this.loginForm.controls.email !== this.email || this.loginForm.controls.password !== this.password) {
      this.isError = true;
    }
  }

  closeError() {
    this.isError = false;
  }

  passwordToggle() {
    this.showPassword = !this.showPassword;
  }
}
