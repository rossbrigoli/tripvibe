import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DataEntryComponent } from './components/data-entry/data-entry.component';
import { SearchComponent } from './components/search/search.component';
import { AltSearchComponent } from './components/alt-search/alt-search.component'


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'data-entry', component: DataEntryComponent },
  { path: 'search', component: SearchComponent },
  { path: 'alt-search', component: AltSearchComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
