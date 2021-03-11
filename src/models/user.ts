/**
 * Created by mmaranda on 7/19/17.
 */
import { Accommodation } from './accommodation';
import { Eligibility } from './eligibility';
import { TripType } from './trip-type';
import { County } from './county';

export class User {
  first_name: string;
  last_name: string;
  email: string;
  accommodations: Accommodation[];
  eligibilities: Eligibility[];
  preferred_locale: string;
  trip_types: TripType[];
  password: string;
  password_confirmation: string;
  age: number;
  paratransit_id: string;
  county: string;
  counties: County[];
}
