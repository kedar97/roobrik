import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StringDecoder } from 'string_decoder';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isError:boolean = false;
  email: string = "rushitvora@gmail.com";
  password: string =  "password";
  showPassword: boolean = false;

  constructor(private router: Router) { }

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl("", [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,4}$')]),
    password: new FormControl(),
  });

  submitForm() {
    console.log("is.loginForm.controls.email", this.loginForm.controls.email);
    if(this.loginForm.controls.email.value !== this.email || this.loginForm.controls.password.value !== this.password) {
      this.isError = true;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  closeError() {
    this.isError = false;
  }

  passwordToggle() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(){
    localStorage.setItem('homePopupShow','true');
  }
}
