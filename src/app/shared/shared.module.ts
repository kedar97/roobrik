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
import { HeaderTwoComponent } from './components/header-two/header-two.component';
import { TableComponent } from './components/table/table.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ExcelExportModule } from 'ag-grid-enterprise';

ModuleRegistry.registerModules([ExcelExportModule]);

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ComingSoonComponent,
    NotificationsComponent,
    LoaderComponent,
    HeaderTwoComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    KendoModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    ComingSoonComponent,
    KendoModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderTwoComponent,
    TableComponent
  ]
})
export class SharedModule { }
