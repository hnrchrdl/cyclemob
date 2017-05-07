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
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { GeolocationService } from './geolocation/geolocation.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    LeafletModule,
    MdButtonModule,
    MdCheckboxModule,
    MdMenuModule,
    MdIconModule,
    MdToolbarModule
  ],
  providers: [GeolocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
