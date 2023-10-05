import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    PostLoginComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class PostLoginModule { }
        