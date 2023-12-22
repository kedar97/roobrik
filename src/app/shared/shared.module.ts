import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { KendoModule } from './kendo/kendo.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ComingSoonComponent,
    NotificationsComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    KendoModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    ComingSoonComponent,
    KendoModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
