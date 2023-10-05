import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { KendoModule } from './kendo/kendo.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    KendoModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    KendoModule,
  ]
})
export class SharedModule { }
