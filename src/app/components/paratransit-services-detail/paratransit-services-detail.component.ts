import { Component, Input, OnInit } from '@angular/core';
import { OneClickServiceModel } from 'src/app/models/one-click-service';

@Component({
  selector: 'app-paratransit-services-detail',
  templateUrl: './paratransit-services-detail.component.html',
  styleUrls: ['./paratransit-services-detail.component.scss'],
})
export class ParatransitServicesDetailComponent implements OnInit {

  @Input('transportationServices') 
  transportationServices: OneClickServiceModel[];

  constructor() { }

  ngOnInit() {}

}
