import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as M from "materialize-css/dist/js/materialize";
import { HomeComponent } from './components/home/home.component';
import { NearbyComponent } from './components/nearby/nearby.component';
import { AboutComponent } from './components/about/about.component';
import { CrowdednessIndicatorComponent } from './components/crowdedness-indicator/crowdedness-indicator.component';

import { HttpClientModule } from '@angular/common/http';
import { VibeIndicatorComponent } from './components/vibe-indicator/vibe-indicator.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NearbyComponent,
    AboutComponent,
    CrowdednessIndicatorComponent,
    VibeIndicatorComponent,
    DataEntryComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});