import { User } from './user';

export class FindServicesHistoryModel {
  id: number;
  service_sub_sub_category:string;
  user_starting_location:string;
  user_starting_lat: number;
  user_starting_lng: number;
  user_id:string;
  trip_id:string;
  user: User;
}
