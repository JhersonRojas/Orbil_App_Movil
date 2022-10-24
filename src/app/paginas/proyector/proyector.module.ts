import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProyectorPageRoutingModule } from './proyector-routing.module';

import { ProyectorPage } from './proyector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProyectorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProyectorPage]
})
export class ProyectorPageModule {}
