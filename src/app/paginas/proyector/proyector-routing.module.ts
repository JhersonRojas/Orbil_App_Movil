import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProyectorPage } from './proyector.page';

const routes: Routes = [
  {
    path: '',
    component: ProyectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProyectorPageRoutingModule {}
