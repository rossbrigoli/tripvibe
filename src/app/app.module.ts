import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as M from "materialize-css/dist/js/materialize";
import { HomeComponent } from './components/home/home.component';
import { NearbyComponent } from './components/nearby/nearby.component';
import { AboutComponent } from './components/about/about.component';
import { CrowdednessIndicatorComponent } from './components/nearby/crowdedness-indicator/crowdedness-indicator.component';

import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NearbyComponent,
    AboutComponent,
    CrowdednessIndicatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});