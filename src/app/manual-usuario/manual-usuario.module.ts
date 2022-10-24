import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManualUsuarioPageRoutingModule } from './manual-usuario-routing.module';

import { ManualUsuarioPage } from './manual-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualUsuarioPageRoutingModule
  ],
  declarations: [ManualUsuarioPage]
})
export class ManualUsuarioPageModule {}
