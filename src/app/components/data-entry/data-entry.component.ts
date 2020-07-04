import { Component, OnInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { DataEntryService } from '../../services/data-entry.service';
import { Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { getuid } from 'process';
import { Guid } from "guid-typescript";
declare var $: any;

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {


  private deviceId : Guid;

  constructor(private nearbyService : NearbyService, private dataEntryService : DataEntryService, 
    private geoService : GeolocationService, private _loc :Location, private router: Router ) {

      //only do this if you cannot find device id from the browser's local storage
      this.deviceId = Guid.create();
  }

  departures = [];
  state; 
  autoFill;
 
  ngOnInit(): void {
    
    this.state = window.history.state;
    
    console.log(this.state);

    if (this.state.navigationId !== 1) {
      this.autoFill = true;
      this.route_type = this.state.type;
      this.stop_name = this.state.stopName;
      this.route_number = this.state.number;
      this.route_direction = this.state.direction;
      this.route_name = this.state.name;
      this.route_number_name = this.route_number + " - " + this.route_name;
      this.loaded =true;
    } else {
      this.autoFill = false;
      this.refreshData();
    }
  }

  loaded = false;
  refreshData() {
    this.nearbyService.getDeparturesNearby().then((data: Observable<any[]>) => {
      data.subscribe((deps) => {
        console.log(deps);
        this.departures = deps;
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
              device_id: this.deviceId
            }
          }
        ).then(result => {
          result.subscribe(c => console.log(c));
          this.submitStatusMessage = "Success";
          this.showFeedback();
        }).catch( err => {
          console.log("Failed" + err);
          this.submitStatusMessage = "Failed";
          this.showFeedback();
        }).finally(() => {
          setTimeout(() => this._loc.back(), 10000);
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
  route_number_name: string;

  refreshStopNames() {
    //Don't display tram tops when user selects Bus as mode of transport
    this.stopNames = this.departures
      .filter(dep => dep.route_type === this.route_type) //filter by selected route type
      .map(c => c.stop_name)
      .filter((thing, i, arr) => arr.findIndex(t => t === thing) === i); //get distinct values
    if (this.stopNames.length === 0) this.stopNames.push("No " + this.route_type + " in your location.");
  }

  refreshRouteNames() {
    //Show only tram lines if user selects tram as mode of transport but also show only route using that selected stop
    this.routeNames = this.departures
      .filter(dep => dep.route_type === this.route_type && dep.stop_name === this.stop_name) //filter by selected route type and stop name
      .filter((thing, i, arr) => arr.findIndex(t => t.route_name === thing.route_name) == i) //filter distinct value
      .map(c => {return {number: c.route_number, name: c.route_name }});

      console.log(this.routeNames);
    if (this.routeNames.length === 0) this.routeNames.push({number: "Oops", name: "No routes in your location."});
  }

  refreshDirectionNames() {
    this.direction_names = this.departures
    .filter(dep => dep.route_type === this.route_type && dep.stop_name === this.stop_name && dep.route_name === this.route_name) //filter by selected route type and stop name
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
  routeNames : any[] = [];
  direction_names : string[];

  showFeedback() {
    //initialize all modals           
    $('.modal').modal();

    //now you can open modal from code
    $('#modal1').modal('open');
  }
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
