import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { DataEntryService } from '../../services/data-entry.service';
import { Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {

  constructor(private nearbyService : NearbyService, private dataEntryService : DataEntryService, private geoService : GeolocationService, private _loc :Location ) { }

  departures = [];
 
  ngOnInit(): void {
    this.refreshData();
  }

  loaded = false;
  refreshData() {
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);
        this.departures = deps.sort((a, b) => new Date(a.departureTime).valueOf() - new Date(b.departureTime).valueOf());
        this.refreshStopNames();
        this.refreshRouteNames();
        this.refreshDirectionNames();
        this.loaded = true;
      } );
    } );
  }

  onSubmit() {
    console.log (
      { 
        capacity: this.capacity, 
        route_direction: this.route_direction, 
        route_number: this.route_number, 
        route_type: this.route_type,
        stop_name: this.stop_name,
        vibe: this.vibe
      });

      let location : any;
      this.geoService.getPosition().then(pos => {
        this.dataEntryService.postData(
          {
            location_lat: pos.lat,
            location_lng: pos.lng,
            sentiment: {
              capacity: this.capacity, 
              route_direction: this.route_direction, 
              route_number: this.route_number, 
              route_type: this.route_type,
              stop_name: this.stop_name,
              vibe: this.vibe,
              departure_time: new Date()
            },
            submitter: {
              device_id: "8316080933289526961"
            }
          }
        ).then(result => {
          result.subscribe(c => console.log(c));
          this.submitStatusMessage = "Success";
        }).catch( err => {
          console.log("Failed" + err);
          this.submitStatusMessage = "Failed";
        }).finally(() => {
          setTimeout(() => this._loc.back(), 1500);
        })
      });
  }

  capacity: number = 50;
  route_direction: string;
  route_number: string;
  route_type: string;
  stop_name: string;
  vibe: number;
  route_name: string;

  refreshStopNames() {
    //Don't display tram tops when user selects Bus as mode of transport
    this.stopNames = this.departures
      .filter(dep => dep.type === this.route_type) //filter by selected route type
      .map(c => c.stopName)
      .filter((thing, i, arr) => arr.findIndex(t => t === thing) === i); //get distinct values
    if (this.stopNames.length === 0) this.stopNames.push("No " + this.route_type + " in your location.");
  }

  refreshRouteNames() {
    //Show only tram lines if user selects tram as mode of transport but also show only route using that selected stop
    this.routeNames = this.departures
      .filter(dep => dep.type === this.route_type && dep.stopName === this.stop_name) //filter by selected route type and stop name
      .filter((thing, i, arr) => arr.findIndex(t => t.name === thing.name) == i) //filter distinct value
      .map(c => [0, c.number, c.name ]);

    if (this.routeNames.length === 0) this.routeNames.push([0, "Oops", "No routes in your location."]);
  }

  refreshDirectionNames() {
    this.direction_names = this.departures
    .filter(dep => dep.type === this.route_type && dep.stopName === this.stop_name && dep.name === this.route_name) //filter by selected route type and stop name
    .map(c => c.direction)
    .filter((thing, i, arr) => arr.findIndex(t => t === thing) == i);

    //console.log("route name" + this.route_name + " -- " +this.route_number);
    //console.log("Refreshed directions " + this.direction_names );
  }

  onRouteTypeChange() {
    this.refreshStopNames();
    this.refreshRouteNames();
    this.refreshDirectionNames();
  }
  
  onStopChange() {
    this.refreshRouteNames();
    this.refreshDirectionNames();
  }

  onRouteChange(){
    this.refreshDirectionNames();
  }

  onBack() {
    this._loc.back()
  }

  submitStatusMessage = "";
  stopNames : string[] = [];
  routeNames : [number, string, string][] = []
  direction_names : string[]

  /*
{
  "location_lat": -27.502,
  "location_lng": 152.897,
  "sentiment": {
    "capacity": 50,
    "route_direction": "City",
    "route_number": "216",
    "route_type": "Bus",
    "stop_name": "Sunshine Station - City via Dynon Rd",
    "vibe": 67,
    "departure_time": "2020-06-23T05:27:24.000Z"
  },
  "submitter": {
    "device_id": "8316080933289526961"
  }
}
  */
}
