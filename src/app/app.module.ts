import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdIconModule,
  MdMenuModule,
  MdToolbarModule,
  } from '@angular/material';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { MapComponent } from './map/map.component';
import { LeafletDirective } from '@asymmetrik/angular2-leaflet';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LeafletDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdButtonModule, MdCheckboxModule, MdMenuModule, MdIconModule, MdToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
