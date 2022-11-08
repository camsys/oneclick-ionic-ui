import { LegModel } from './leg';
import { OneClickServiceModel } from './one-click-service';

export class ItineraryModel {
  id: number;
  trip_type:string;
  cost:number;
  wait_time:number;
  walk_time:number;
  transit_time:number;
  walk_distance:number;
  legs:LegModel[];
  service:OneClickServiceModel;
  duration:number;
}
