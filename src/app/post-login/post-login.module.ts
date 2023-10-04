import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PostLoginComponent } from './post-login.component';
import { PostLoginRoutingModule } from './post-login-routing.module';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { CardModule} from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { DialogComponent } from './components/dialog/dialog.component';
import { LayoutModule } from "@progress/kendo-angular-layout";
import { GridModule } from "@progress/kendo-angular-grid";
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { DialogsModule } from '@progress/kendo-angular-dialog';


import { LabelModule } from "@progress/kendo-angular-label";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/ProfileComponent';
import { StandardReportsComponent } from './components/standard-reports/standard-reports.component';


import { AgGridAngular } from 'ag-grid-angular';
import { AgGridModule } from 'ag-grid-angular';
import { AgCheckboxComponent } from './components/standard-reports/ag-checkbox/ag-checkbox.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PostLoginComponent,
    DialogComponent,
    ProfileComponent,
    StandardReportsComponent,
    AgCheckboxComponent,
  ],
  imports: [
    CommonModule,
    PostLoginRoutingModule,
    NavigationModule,
    CardModule,
    ButtonModule,
    IconsModule,
    GridModule,
    LayoutModule,
    SVGIconModule,
    DialogsModule,
    InputsModule,
    LabelModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule
    
  
 
  ],
  
})
export class PostLoginModule { }
