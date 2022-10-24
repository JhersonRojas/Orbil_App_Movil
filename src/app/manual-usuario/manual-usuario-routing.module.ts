import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualUsuarioPage } from './manual-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ManualUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualUsuarioPageRoutingModule {}
