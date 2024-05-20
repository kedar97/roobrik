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
import { EditSaasRevenueComponent } from './components/financial-data/edit-saas-revenue/edit-saas-revenue.component';
import { AnnouncementManagementComponent } from './components/announcement-management/announcement-management.component';
import { CustomDropDownEditorComponent } from './components/financial-data/custom-drop-down-editor/custom-drop-down-editor.component';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AddNewClientComponent } from './components/financial-data/add-new-client/add-new-client.component';
import { CustomGroupsComponent } from './components/custom-groups/custom-groups.component';
import { CustomMenuEditorComponent } from './components/custom-groups/custom-menu-editor/custom-menu-editor.component';
import { CreateNewGroupComponent } from './components/custom-groups/create-new-group/create-new-group.component';
import { ChatNodeCategoriesComponent } from './components/chat-configuration/chat-node-categories/chat-node-categories.component';
import { ChatQuestionAnswerComponent } from './components/chat-configuration/chat-question-answer/chat-question-answer.component';
import { ChatQuestionAnswerClientComponent } from './components/chat-configuration/chat-question-answer-client/chat-question-answer-client.component';
import { ChatQuestionAnswerFranchiseComponent } from './components/chat-configuration/chat-question-answer-franchise/chat-question-answer-franchise.component';
import { CustomDatePickerComponent } from './components/custom-groups/custom-date-picker/custom-date-picker.component';

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
    EditSaasRevenueComponent,
    AnnouncementManagementComponent,
    CustomDropDownEditorComponent,
    AddNewClientComponent,
    CustomGroupsComponent,
    CustomMenuEditorComponent,
    CreateNewGroupComponent,
    ChatNodeCategoriesComponent,
    ChatQuestionAnswerComponent,
    ChatQuestionAnswerClientComponent,
    ChatQuestionAnswerFranchiseComponent,
    CustomDatePickerComponent,
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
    TooltipModule
  ],
  exports: [],
})
export class PostLoginModule {}
