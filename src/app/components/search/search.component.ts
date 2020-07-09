import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private searchService : SearchService, public router: Router) { }

  departures = [];
  loaded = true;
  resultEmpty = false;
  routeType : number = 2;
  search_term : string;
  includeRecentTrips: number;

  enablePastTrips : boolean = false;

  ngOnInit(): void {
  }

  getTypeIcon(type : string) {
    if (type.toLowerCase() === "bus")
      return "directions_bus";
    else if (type.toLowerCase() === "tram")
      return "tram";
    else if (type.toLowerCase() === "train" || type.toLowerCase() == "vline")
      return "directions_transit";
  }

  getTypeColor(type: string) {
    if (type.toLowerCase() === "bus")
      return "orange";
    else if (type.toLowerCase() === "tram")
      return "green";
    else if (type.toLowerCase() === "train" || type.toLowerCase() == "vline")
      return "purple";
  }

  now = new Date();
  search(){
    this.loaded = false;
    this.resultEmpty = false;
    
    //console.log("recent trips? " + this.includeRecentTrips)
    if (this.enablePastTrips) {
      // from 15 minutes ago 
      this.includeRecentTrips = 15*60;
    } else {
      this.includeRecentTrips = 0;
    }

    this.searchService.searchDepartures(this.search_term, this.routeType, this.includeRecentTrips).then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);

        if (deps == undefined || deps.length === 0) {
          this.resultEmpty = true;
          this.loaded = true;
          return;
        }

        var items = deps.map(d => {
          return { departure: d, vibe: d.vibe === -1 ? 50 : d.vibe, capacity: d.capacity === -1 ? 50 : d.capacity }; // TODO: REPLACE THIS WITH REAL CAPACITY and VIBE API CALL
        });

        //console.log(items);

        this.departures = items.sort((a, b) => new Date(a.departure.departure_time).valueOf() - new Date(b.departure.departure_time).valueOf());
        this.loaded = true;

        //console.log(this.departures);
      } );
    } );
  
    this.now = new Date();
  }

  getETA(depTime: string) : number {
    let eta : number = new Date(depTime).valueOf() - this.now.valueOf();
    let minETA = Math.ceil(eta / 1000 / 60);
    return minETA;
  }

  getETAText(depTime: string) : string {
    let minETA = this.getETA(depTime);
    return minETA < 0 ? Math.abs(minETA).toString() + " min ago" : (minETA == 0 ? "Now" : minETA.toString() + " min");
  }

  navigateWithState(item): void {
    this.router.navigateByUrl (
      '/data-entry', {state: item.departure}
    )
  }

}
