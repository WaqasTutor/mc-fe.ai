import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AiContentOutputComponent } from './ai-content-output.component';

const routes: Routes = [
  {
    path: 'contents',
    component: AiContentOutputComponent,
    data: { title: 'Content', headerDisplay: "none" }
  },
  {
    path: 'contents/:id',
    component: AiContentOutputComponent,
    data: { title: 'Content', headerDisplay: "none" }
  },
  {
    path: 'projects/:uuid/contents',
    component: AiContentOutputComponent,
    data: { title: 'Contents', headerDisplay: "none" }
  },
  {
    path: 'projects/:uuid/contents/:cid',
    component: AiContentOutputComponent,
    data: { title: 'Contents', headerDisplay: "none" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AiContentOutputRoutingModule { }
