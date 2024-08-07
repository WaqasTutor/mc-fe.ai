import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrashComponent } from './trash.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'contents',
    pathMatch: 'full'
  },
  {
    path: ':type',
    component: TrashComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashRoutingModule { }
