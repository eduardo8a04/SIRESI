import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DenunciasInfoPage } from './denuncias-info.page';

const routes: Routes = [
  {
    path: '',
    component: DenunciasInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DenunciasInfoPageRoutingModule {}
