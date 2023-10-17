import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { StandardReportsComponent } from './components/standard-reports/standard-reports.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ExcelExportModule } from 'ag-grid-enterprise';
import { LeadRoutingComponent } from './lead-routing/lead-routing.component';

ModuleRegistry.registerModules([ExcelExportModule]);

@NgModule({
  declarations: [
    HomeComponent,
    PostLoginComponent,
    ProfileComponent,
    DialogComponent,
    StandardReportsComponent,
    LeadRoutingComponent,
  ],
  imports: [CommonModule, PostLoginRoutingModule, SharedModule, AgGridModule],
  exports: [],
})
export class PostLoginModule {}
