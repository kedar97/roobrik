import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { PreLoginComponent } from './pre-login.component';
import { PreLoginRoutingModule } from './pre-login-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    PreLoginComponent
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
