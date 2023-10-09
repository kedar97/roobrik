import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostLoginComponent,
    ProfileComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    SharedModule,
  ],
  exports: [
  ]
})
export class PostLoginModule { }
        