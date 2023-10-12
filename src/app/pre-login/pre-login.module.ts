import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { PreLoginComponent } from './pre-login.component';
import { PreLoginRoutingModule } from './pre-login-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    PreLoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    PreLoginRoutingModule,
    SharedModule
  ],
  exports: [
  ]
})
export class PreLoginModule { }
