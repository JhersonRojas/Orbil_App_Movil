import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComputadorPage } from './computador.page';

const routes: Routes = [
  {
    path: '',
    component: ComputadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputadorPageRoutingModule {}
