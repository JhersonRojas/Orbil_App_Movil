import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComputadorPageRoutingModule } from './computador-routing.module';

import { ComputadorPage } from './computador.page';
import { ListaComponent } from './lista_component/lista.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComputadorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ComputadorPage, ListaComponent]
})
export class ComputadorPageModule {}
