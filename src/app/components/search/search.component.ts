import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private nearbyService : NearbyService, public router: Router) { }

  departures = [];
  loaded = true;

  ngOnInit(): void {
    //this.refresh();
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
  refresh(){
    this.loaded = false;
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);

        var items = deps.map(d => {
          return { departure: d, vibe: 50, capacity: 50 }; // TODO: REPLACE THIS WITH REAL CAPACITY and VIBE API CALL
        });

        //console.log(items);

        this.departures = items.sort((a, b) => new Date(a.departure.departure_time).valueOf() - new Date(b.departure.departure_time).valueOf());
        this.loaded = true;

        //console.log(this.departures);
      } );
    } );
  
    this.now = new Date();
  }

  getETA(depTime: string) : string {
    let eta : number = new Date(depTime).valueOf() - this.now.valueOf();
    let minETA = Math.ceil(eta / 1000 / 60);
    return minETA <= 0 ? " Now" : minETA.toString() + " min";
  }

  navigateWithState(index): void {
    this.router.navigateByUrl (
      '/data-entry', {state: {
        type: this.departures[index].type,
        stopName: this.departures[index].stopName,
        number: this.departures[index].number,
        name: this.departures[index].name,
        direction: this.departures[index].direction
      }}
    )
  }

}
