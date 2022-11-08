import { AddressComponentModel } from './address-component';
import { OneClickPlaceModel } from "./one-click-place";

export class GooglePlaceModel {
  name: string;
  address_components: AddressComponentModel[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number,
      lng: number
    }
  };
  place_id: string;
  types: string[];
  
  constructor(attrs: any) { 
    this.name = (attrs.name || "").replace(/, USA$/, "");
    this.address_components = attrs.address_components || [];
    this.formatted_address = (attrs.formatted_address || "").replace(/, USA$/, "");
    this.geometry = attrs.geometry || {};
    this.place_id = attrs.place_id || null;
    this.types = attrs.types || [];
  }

  toOneClickPlace(): OneClickPlaceModel {
    return new OneClickPlaceModel({
      name: this.label(),
      lat: this.lat(),
      lng: this.lng(),
      street_number: this.addressComponent("street_number").long_name,
      route: this.addressComponent("route").long_name,
      city: this.addressComponent("locality").long_name,
      county: this.addressComponent("county").long_name || this.addressComponent("administrative_area_level_2").long_name,
      zip: this.addressComponent("postal_code").long_name,
      state: this.addressComponent("administrative_area_level_1").long_name
    })
  }

  /**
   * NOTE: if addressComponent() can't find the component, the fallback causes other code to fail
   * @param type is a string that's generally the below values:
   * - 'street_number'
   * - 'route'
   * - 'county' OR 'administrative_area_level_2'
   * - 'postal_code'
   * - 'locality'
   * - 'administrative_area_level_1'
   * @returns AddressComponentModel
   */
  addressComponent(type: string) {
    // Find and return the first address component that matches the input type
    const addrComp = this.address_components
                   .find((ac) => {
                     // Filter by address_components with the the right type...
                     return ac.types.findIndex((t) => t === type) > -1;
                   });
    return addrComp || new AddressComponentModel();
  }

  // Returns a label for the place, either from the address components or using the formatted address
  label() {
    return (this.name || 
           this.addressComponent(this.types[0])["long_name"] || 
           this.formatted_address).replace(/, USA$/, "");
  }
  
  // Pulls out the lat, or null if not present
  lat() {
    return this.geometry && this.geometry.location && this.geometry.location.lat;
  }
  
  // Pulls out the lng, or null if not present
  lng() {
    return this.geometry && this.geometry.location && this.geometry.location.lng;
  }
  
  // Returns true/false if item has lat and lng present
  isGeocoded(): Boolean {
    return !!(this.lat() && this.lng());
  }

  setAddressComponents(addrComp: AddressComponentModel[]): void {
    this.address_components = addrComp
  }
}
