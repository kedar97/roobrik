import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostLoginComponent } from './post-login.component';
import { HomeComponent } from './components/home/home.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ProfileComponent } from './components/profile/ProfileComponent';
import { StandardReportsComponent } from './components/standard-reports/standard-reports.component';

const routes: Routes = [
  {
    path:'',
    component: PostLoginComponent,
    children: [
      {
        path: '',
        component: HomeComponent,

      },
      {
        path:'select',
        component:DialogComponent,
      },
      {
        path:'profile',
        component:ProfileComponent,
      },
      {
        path:'standardReports',
        component:StandardReportsComponent
      }
      
    ],
  },
  
  
  
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class PostLoginRoutingModule { }
