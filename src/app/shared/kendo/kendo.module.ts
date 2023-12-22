import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { CardModule, LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconsModule, SVGIconModule } from '@progress/kendo-angular-icons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavigationModule,
    CardModule,
    ButtonModule,
    LayoutModule,
    IconsModule,
    SVGIconModule,
    GridModule,
    DialogsModule,
    InputsModule,
    LabelModule,
    IndicatorsModule
  ],
  exports: [
    NavigationModule,
    CardModule,
    ButtonModule,
    LayoutModule,
    IconsModule,
    SVGIconModule,
    GridModule,
    DialogsModule,
    InputsModule,
    LabelModule,
    IndicatorsModule

  ]
})
export class KendoModule { }
