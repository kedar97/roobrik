import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IconsModule } from '@progress/kendo-angular-icons';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { SharedModule } from './shared/shared.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { NotificationModule } from '@progress/kendo-angular-notification';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavigationModule,
    BrowserAnimationsModule,
    LayoutModule,
    NavigationModule,
    IconsModule,
    ButtonsModule,
    SharedModule,
    GridModule,
    NotificationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
