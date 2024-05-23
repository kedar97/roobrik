import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostLoginComponent } from './post-login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StandardReportsComponent } from './components/standard-reports/standard-reports.component';
import { LeadRoutingComponent } from './components/lead-routing/lead-routing.component';
import { CustomReportsComponent } from './components/custom-reports/custom-reports.component';
import { AddEditLeadRoutingComponent } from './components/add-edit-lead-routing/add-edit-lead-routing.component';
import { ComingSoonComponent } from '../shared/components/coming-soon/coming-soon.component';
import { LeadsPerCommunityComponent } from './components/leads-per-community/leads-per-community.component';
import { FinancialDataComponent } from './components/financial-data/financial-data.component';
import { EditSaasRevenueComponent } from './components/financial-data/edit-saas-revenue/edit-saas-revenue.component';
import { AnnouncementManagementComponent } from './components/announcement-management/announcement-management.component';
import { UnsavedChangesGuard } from './components/financial-data/edit-saas-revenue/unsaved-changes.guard';
import { AddNewClientComponent } from './components/financial-data/add-new-client/add-new-client.component';
import { CustomGroupsComponent } from './components/custom-groups/custom-groups.component';
import { CreateNewGroupComponent } from './components/custom-groups/create-new-group/create-new-group.component';
import { ChatNodeCategoriesComponent } from './components/chat-configuration/chat-node-categories/chat-node-categories.component';
import { ChatQuestionAnswerComponent } from './components/chat-configuration/chat-question-answer/chat-question-answer.component';
import { ChatQuestionAnswerClientComponent } from './components/chat-configuration/chat-question-answer-client/chat-question-answer-client.component';
import { ChatQuestionAnswerFranchiseComponent } from './components/chat-configuration/chat-question-answer-franchise/chat-question-answer-franchise.component';
import { EditMembershipComponent } from './components/custom-groups/edit-membership/edit-membership.component';
const routes: Routes = [
  {
    path: '',
    component: PostLoginComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'standard-reports',
        component: StandardReportsComponent,
      },
      {
        path: 'custom-reports',
        component: CustomReportsComponent,
      },
      {
        path: 'lead-routing',
        component: LeadRoutingComponent,
      },
      {
        path: 'create-lead-routing',
        component: AddEditLeadRoutingComponent,
      },
      {
        path: 'edit-lead-routing',
        component: AddEditLeadRoutingComponent,
      },
      {
        path: 'coming-soon',
        component: ComingSoonComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  {
    path:'',
    component:PostLoginComponent,
    children : [
      {
        path: 'saas-revenue',
        component: FinancialDataComponent,
      },
      {
        path: 'saas-revenue/new-client',
        component: AddNewClientComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
      {
        path: 'saas-revenue/:client_frenchiseName',
        component: EditSaasRevenueComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
      {
        path: 'client-health-metrics',
        component: LeadsPerCommunityComponent,
      },
      {
        path: 'custom-groups',
        component: CustomGroupsComponent,
      },
      {
        path: 'custom-groups/create-new-custom-group',
        component: CreateNewGroupComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
      {
        path: 'custom-groups/edit-membership',
        component: EditMembershipComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
    ]
  },

  {
    path:'',
    component:PostLoginComponent,
    children : [
      {
        path: 'announcement-management',
        component:AnnouncementManagementComponent,
      },
    ]
  },

  {
    path:'',
    component:PostLoginComponent,
    children : [
      {
        path: 'chat-node-categories',
        component:ChatNodeCategoriesComponent,
      },
      {
        path: 'chat-question-answer',
        component:ChatQuestionAnswerComponent,
      },
      {
        path: 'chat-question-answer-client',
        component:ChatQuestionAnswerClientComponent,
      },
      {
        path:'chat-question-answer-franchise',
        component:ChatQuestionAnswerFranchiseComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostLoginRoutingModule {}
