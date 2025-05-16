
/// <reference types="vite/client" />

declare interface Window {
  google: any;
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: google.maps.MapOptions);
  }
  
  class Marker {
    constructor(opts?: google.maps.MarkerOptions);
  }
  
  class Geocoder {
    constructor();
    geocode(request: any, callback: (results: any, status: any) => void): void;
  }
  
  interface MapOptions {
    center: {lat: number, lng: number};
    zoom: number;
    [key: string]: any;
  }
  
  interface MarkerOptions {
    position: {lat: number, lng: number};
    map: google.maps.Map;
    title?: string;
    [key: string]: any;
  }
  
  var GeocoderStatus: {
    OK: string;
    [key: string]: any;
  };
}

