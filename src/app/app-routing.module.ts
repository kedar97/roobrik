import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./post-login/post-login.module').then((m) => m.PostLoginModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pre-login/pre-login.module').then((m) => m.PreLoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
