import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NearbyService } from '../../services/nearby.service';
import { DataEntryService } from '../../services/data-entry.service';
import { Observable } from 'rxjs';
import { GeolocationService } from '../../services/geolocation.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Guid } from "guid-typescript";
import { Departure } from 'src/app/models/departure.model';
import { Stop } from 'src/app/models/stop.model';
import { XRoute } from 'src/app/models/xroute.model';
import { Direction } from 'src/app/models/direction.model';
import { StopsService } from 'src/app/services/stops.service';
import * as M  from 'materialize-css';
import { Submission } from 'src/app/models/submission.model';
import { Sentiment } from 'src/app/models/sentiment.model';
import { Submitter } from 'src/app/models/submitter.model';


declare var $: any;

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit, AfterViewInit {


  private deviceId : Guid;

  constructor(private nearbyService : NearbyService, private dataEntryService : DataEntryService, 
    private geoService : GeolocationService, private _loc :Location, private router: Router, private stopsService : StopsService ) {

      //only do this if you cannot find device id from the browser's local storage
      this.deviceId = Guid.create();
  }

  departures : Departure[] = [];
  state; 
  autoFill;
 
  selected_stop : Stop;
  selected_route : XRoute;
  selected_direction : Direction;
  stops : Stop[];
  routes : XRoute[];
  directions : Direction[];
  otherStops : Stop[] = [];

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

  ngAfterViewInit(){
      var selectElems = document.querySelectorAll('select');
      var instances = M.FormSelect.init(selectElems);
  }

  loaded = false;
  refreshData() {
    this.nearbyService.getDeparturesForDataEntry().then((data: Observable<any[]>) => {
      data.subscribe((deps : Departure[]) => {
        console.log(deps);
        this.departures = deps;//.sort((a, b) => new Date(a.departure_time).valueOf() - new Date(b.departure_time).valueOf());
        this.refreshRouteNames();
        this.refreshDirectionNames();
        this.refreshStopNames();
        this.loaded = true;
      } );
    } );
  }

  generateSubmission() : Submission {
    //find the departure that matches to the user's selections
    let matchingDepartures = this.departures.filter(c =>
      c.route_type === this.selected_route.route_type &&
      c.route_id === this.selected_route.route_id &&
      c.direction_id === this.selected_direction.direction_id &&
      c.stop_id === this.selected_stop.stop_id);

    let match :Departure;

    console.log(matchingDepartures);

    //If multiple matches, pickup the one with the closest departure time
    if (matchingDepartures.length === 1) {
      match = matchingDepartures[0];
    } else {
      match = matchingDepartures.sort((a, b) => a.departure_time.valueOf() - b.departure_time.valueOf())[0];
    }

    let sentiment = new Sentiment();

    console.log(match);

    sentiment.at_platform = match.at_platform;
    sentiment.departure_time = match.departure_time;
    sentiment.direction = match.direction;
    sentiment.direction_id = match.direction_id;
    sentiment.platform_number = match.platform_number;
    sentiment.route_id = match.route_id;
    sentiment.route_number = match.route_number;
    sentiment.route_type = this.getRouteTypeNumber(match.route_type);
    sentiment.run_id = match.run_id;
    sentiment.stop_id = match.stop_id;
    sentiment.stop_name = match.stop_name;
    sentiment.vibe = this.vibe;
    sentiment.capacity = this.capacity;

    let submitter = new Submitter();
    submitter.device_id = this.deviceId.toString()

    console.log(submitter);

    let submission = new Submission()
    submission.sentiment = sentiment;
    submission.submitter = submitter;

    return submission;
  }

  onSubmit() {
    let submission = this.generateSubmission();

    console.log (submission);

      this.geoService.getPosition().then(pos => {
        this.dataEntryService.postData(submission)
        .then(result => {
          result.subscribe(c => console.log(c));
          this.submitStatusMessage = "Success";
          this.showFeedback();
        }).catch( err => {
          console.log("Failed" + err);
          this.submitStatusMessage = "Failed";
          this.showFeedback();
        }).finally(() => {
          //setTimeout(() => this._loc.back(), 10000);
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
    this.stops = [];
    //Don't display tram tops when user selects Bus as mode of transport
    this.stops = this.departures
      .filter(dep => dep.route_type === this.route_type && dep.route_id === this.selected_route.route_id 
        && dep.direction_id === this.selected_direction.direction_id) //filter by selected route type
      .sort((a,b) => a.stop_id - b.stop_id)
      .map(c => {
        let stp = new Stop();
        stp.stop_id = c.stop_id;
        stp.stop_name = c.stop_name;
        stp.route_type = this.getRouteTypeNumber(c.route_type);
        stp.stop_suburb = "";

        return stp;
      })
      .filter((thing, i, arr) => arr.findIndex(t => t.stop_id === thing.stop_id) === i); //get distinct values

    this.getOtherStops();

    if (this.stops.length !== 0) {
      this.selected_stop = this.stops[0];
    } else if (this.otherStops.length !== 0) {
      this.selected_stop = this.otherStops[0];
    }
  }

  getOtherStops() {
    if (this.selected_route !== undefined) {
      this.stopsService.getStopsByRoute(this.selected_route.route_id, this.getRouteTypeNumber(this.selected_route.route_type))
       .then((response : Observable<any>) => 
         response.subscribe(c => {
           console.log(c.stops);
           let oStops : Stop[] = c.stops;

           if (this.geoService.isGeoLocationEnabled) {
            this.geoService.getPosition().then(pos => {
              oStops.forEach(stp => stp.stop_distance = this.getEuclideanDistance([stp.stop_latitude, stp.stop_longitude],[pos.lat, pos.lng]));
            });
           }

           this.otherStops = oStops.filter(stp => !this.stops.map(c => c.stop_id).includes(stp.stop_id))
            .sort((a,b) => a.stop_distance - b.stop_distance)
            //.sort((a,b) => a.stop_id - b.stop_id);
         }));
   }
  }

  getEuclideanDistance(p : [number, number], q: [number, number]) {
    const subtracted = q.map((i, n) => i - p[n]);
    const powered = subtracted.map(e => Math.pow(e, 2));
    const sum = powered.reduce((total, current) => total + current, 0)
    return Math.sqrt(sum);
  }

  refreshRouteNames() {
    //Show only tram lines if user selects tram as mode of transport but also show only route using that selected stop
    this.routes = this.departures
      .filter(dep => dep.route_type === this.route_type) //filter by selected route type
      .filter((thing, i, arr) => arr.findIndex(t => t.route_id === thing.route_id) == i) //filter distinct value
      .map(c => {return {route_id: c.route_id, route_number: c.route_number, route_name: c.route_name, route_type: c.route_type }});

    if (this.routes.length === 0) {
      this.selected_route = null;
    }

    this.selected_route = this.routes[0];
  }

  refreshDirectionNames() {
    this.directions = this.departures
    .filter(dep => dep.route_type === this.route_type && dep.route_id === this.selected_route.route_id) //filter by selected route type and stop name
    .map(c => {return {direction_id : c.direction_id, direction_name : c.direction, route_type: c.route_type}})
    .filter((thing, i, arr) => arr.findIndex(t => t.direction_id === thing.direction_id) == i);

    if (this.directions.length === 0) {
      this.selected_direction = null;
    }

    this.selected_direction = this.directions[0];
  }

  onRouteTypeChange() {
    this.refreshRouteNames();
    this.refreshDirectionNames();
    this.refreshStopNames();
  }
  
  onStopChange() {
    console.log(this.selected_stop.stop_id);
  }

  onRouteChange(){
    this.refreshDirectionNames();
    this.refreshStopNames();
  }

  onDirectionChange() {
    this.refreshStopNames()
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
  
  private getRouteTypeNumber(routeType: string) : number {
    switch (routeType) {
      case "Train": return 0
      case "Tram" : return 1
      case "Bus" : return 2
      case "Vline" : return 3
      case "Night Bus" : return 4
      default: { throw new Error("Unknown route type.")}
    }
  }
}

