import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DenunciasInfoPageRoutingModule } from './denuncias-info-routing.module';

import { DenunciasInfoPage } from './denuncias-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DenunciasInfoPageRoutingModule
  ],
  declarations: [DenunciasInfoPage]
})
export class DenunciasInfoPageModule {}
