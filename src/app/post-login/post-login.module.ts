import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { CardModule, LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PostLoginComponent
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    NavigationModule,
    CardModule,
    ButtonModule,
    LayoutModule,
    IconsModule,
  ]
})
export class PostLoginModule { }
