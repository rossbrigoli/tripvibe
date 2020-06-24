import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-crowdedness-indicator',
  templateUrl: './crowdedness-indicator.component.html',
  styleUrls: ['./crowdedness-indicator.component.scss']
})
export class CrowdednessIndicatorComponent implements OnInit {

  constructor() { }

  @Input() capacity: number
  filledIcons = [];
  unfilledIcons = [];

  ngOnInit(): void {  
    // const stars = Math.ceil(this.capacity / 20)
    // Temporary workaround while percentages aren't returned
    const icons = Math.ceil(Math.min(this.capacity, 100) / 25)
    this.filledIcons = new Array(icons)
    this.unfilledIcons = new Array(4 - icons)
  }
}
