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
        path: 'leads-per-community',
        component: LeadsPerCommunityComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostLoginRoutingModule {}
