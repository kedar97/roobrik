import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialDataComponent } from './post-login/components/financial-data/financial-data.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./post-login/post-login.module').then((m) => m.PostLoginModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
    import('./post-login/post-login.module').then((m) => m.PostLoginModule),
  },
  {
    path: 'client-dashbaord',
    loadChildren: () =>
    import('./post-login/post-login.module').then((m) => m.PostLoginModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pre-login/pre-login.module').then((m) => m.PreLoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
