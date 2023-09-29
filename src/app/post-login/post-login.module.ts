import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PostLoginComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule
  ]
})
export class PostLoginModule { }
