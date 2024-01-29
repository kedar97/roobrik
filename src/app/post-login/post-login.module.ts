import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { StandardReportsComponent } from './components/standard-reports/standard-reports.component';
import { CustomReportsComponent } from './components/custom-reports/custom-reports.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from 'ag-grid-community';
import { ExcelExportModule } from 'ag-grid-enterprise';
import { LeadRoutingComponent } from './components/lead-routing/lead-routing.component';
import { AddEditLeadRoutingComponent } from './components/add-edit-lead-routing/add-edit-lead-routing.component';
import { LeadsPerCommunityComponent } from './components/leads-per-community/leads-per-community.component';
import {
  DropDownTreesModule,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { FinancialDataComponent } from './components/financial-data/financial-data.component';
import { TourVideoPopUpComponent } from './components/tour-video-pop-up/tour-video-pop-up.component';
import { AnnouncementBannerComponent } from './components/announcement-banner/announcement-banner.component';
ModuleRegistry.registerModules([ExcelExportModule]);

@NgModule({
  declarations: [
    HomeComponent,
    PostLoginComponent,
    ProfileComponent,
    DialogComponent,
    StandardReportsComponent,
    CustomReportsComponent,
    LeadRoutingComponent,
    AddEditLeadRoutingComponent,
    LeadsPerCommunityComponent,
    FinancialDataComponent,
    TourVideoPopUpComponent,
    AnnouncementBannerComponent,
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    SharedModule,
    AgGridModule,
    MultiSelectModule,
    DropDownTreesModule,
    DateInputsModule,
    ChartsModule,
  ],
  exports: [],
})
export class PostLoginModule {}
