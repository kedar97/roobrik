import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostLoginComponent } from './post-login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: PostLoginComponent,
    children: [
      {
        path:'profile',
          component: ProfileComponent,
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
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class PostLoginRoutingModule { }
