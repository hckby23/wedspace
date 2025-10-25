/**
 * Type declarations for Google Maps API
 * This file provides TypeScript declarations for Google Maps API elements
 * that might not be fully covered by the @googlemaps/js-api-loader package
 */

declare module '@googlemaps/js-api-loader' {
  export interface LoaderOptions {
    apiKey: string;
    version?: string;
    libraries?: string[];
    language?: string;
    region?: string;
    retries?: number;
    mapIds?: string[];
    nonce?: string;
    authReferrerPolicy?: string;
  }

  export class Loader {
    constructor(options: LoaderOptions);
    load(): Promise<typeof google>;
    loadCallback(fn: (e: Error | null) => void): void;
    importLibrary(library: string): Promise<any>;
  }
}

declare namespace google {
  namespace maps {
    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    type Animation = number;
    
    namespace Animation {
      export const DROP: number;
      export const BOUNCE: number;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map?: Map, anchor?: MVCObject): void;
      open(map?: Map): void;
      close(): void;
      getContent(): string | Element | Text;
      getPosition(): LatLng;
      setContent(content: string | Node): void;
      setPosition(position: LatLng | LatLngLiteral): void;
      setZIndex(zIndex: number): void;
    }
    
    class Marker extends MVCObject {
      constructor(opts?: MarkerOptions);
      getAnimation(): Animation | null;
      getClickable(): boolean;
      getCursor(): string | null;
      getDraggable(): boolean;
      getIcon(): string | Icon | Symbol | null;
      getLabel(): MarkerLabel | null;
      getMap(): Map | StreetViewPanorama | null;
      getOpacity(): number | null;
      getPosition(): LatLng | null;
      getShape(): MarkerShape | null;
      getTitle(): string | null;
      getVisible(): boolean;
      getZIndex(): number | null;
      setAnimation(animation: Animation | null): void;
      setClickable(clickable: boolean): void;
      setCursor(cursor: string | null): void;
      setDraggable(draggable: boolean): void;
      setIcon(icon: string | Icon | Symbol | null): void;
      setLabel(label: string | MarkerLabel | null): void;
      setMap(map: Map | StreetViewPanorama | null): void;
      setOpacity(opacity: number | null): void;
      setOptions(options: MarkerOptions): void;
      setPosition(position: LatLng | LatLngLiteral | null): void;
      setShape(shape: MarkerShape | null): void;
      setTitle(title: string | null): void;
      setVisible(visible: boolean): void;
      setZIndex(zIndex: number | null): void;
    }
    
    interface MarkerOptions {
      anchorPoint?: Point;
      animation?: Animation;
      clickable?: boolean;
      crossOnDrag?: boolean;
      cursor?: string;
      draggable?: boolean;
      icon?: string | Icon | Symbol;
      label?: string | MarkerLabel;
      map?: Map | StreetViewPanorama;
      opacity?: number;
      optimized?: boolean;
      position: LatLng | LatLngLiteral;
      shape?: MarkerShape;
      title?: string;
      visible?: boolean;
      zIndex?: number;
    }
    
    interface MarkerLabel {
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      text: string;
    }
    
    interface MarkerShape {
      coords: number[];
      type: string;
    }
    
    interface Icon {
      anchor?: Point;
      labelOrigin?: Point;
      origin?: Point;
      scaledSize?: Size;
      size?: Size;
      url: string;
    }
    
    interface Symbol {
      anchor?: Point;
      fillColor?: string;
      fillOpacity?: number;
      labelOrigin?: Point;
      path: string | SymbolPath;
      rotation?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }
    
    enum SymbolPath {
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      CIRCLE,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW
    }
    
    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      width: number;
      height: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      disableAutoPan?: boolean;
      maxWidth?: number;
      pixelOffset?: Point;
      position?: LatLng | LatLngLiteral;
      zIndex?: number;
    }
    
    class Map extends MVCObject {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
      getBounds(): LatLngBounds | undefined;
      getCenter(): LatLng;
      getDiv(): Element;
      getHeading(): number;
      getMapTypeId(): string;
      getProjection(): Projection;
      getZoom(): number;
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panBy(x: number, y: number): void;
      setOptions(options: MapOptions): void;
      getStreetView(): StreetViewPanorama;
      getTilt(): number;
      panBy(x: number, y: number): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panToBounds(latLngBounds: LatLngBounds | LatLngBoundsLiteral, padding?: number | Padding): void;
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setHeading(heading: number): void;
      setMapTypeId(mapTypeId: string): void;
      setOptions(options: MapOptions): void;
      setStreetView(panorama: StreetViewPanorama): void;
      setTilt(tilt: number): void;
      setZoom(zoom: number): void;
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      clickableIcons?: boolean;
      controlSize?: number;
      disableDefaultUI?: boolean;
      disableDoubleClickZoom?: boolean;
      draggable?: boolean;
      draggableCursor?: string;
      draggingCursor?: string;
      fullscreenControl?: boolean;
      fullscreenControlOptions?: FullscreenControlOptions;
      gestureHandling?: string;
      heading?: number;
      keyboardShortcuts?: boolean;
      mapTypeControl?: boolean;
      mapTypeControlOptions?: MapTypeControlOptions;
      mapTypeId?: string;
      maxZoom?: number;
      minZoom?: number;
      noClear?: boolean;
      panControl?: boolean;
      panControlOptions?: PanControlOptions;
      restriction?: MapRestriction;
      rotateControl?: boolean;
      rotateControlOptions?: RotateControlOptions;
      scaleControl?: boolean;
      scaleControlOptions?: ScaleControlOptions;
      scrollwheel?: boolean;
      streetView?: StreetViewPanorama;
      streetViewControl?: boolean;
      streetViewControlOptions?: StreetViewControlOptions;
      styles?: MapTypeStyle[];
      tilt?: number;
      zoom?: number;
      zoomControl?: boolean;
      zoomControlOptions?: ZoomControlOptions;
    }
    
    interface MapTypeStyle {
      elementType?: string;
      featureType?: string;
      stylers?: MapTypeStyler[];
    }
    
    interface MapTypeStyler {
      [key: string]: string | number | boolean;
    }
    
    interface FullscreenControlOptions {
      position?: ControlPosition;
    }
    
    interface MapTypeControlOptions {
      mapTypeIds?: string[];
      position?: ControlPosition;
      style?: MapTypeControlStyle;
    }
    
    interface MapRestriction {
      latLngBounds: LatLngBounds | LatLngBoundsLiteral;
      strictBounds?: boolean;
    }
    
    interface PanControlOptions {
      position?: ControlPosition;
    }
    
    interface RotateControlOptions {
      position?: ControlPosition;
    }
    
    interface ScaleControlOptions {
      style?: ScaleControlStyle;
    }
    
    interface StreetViewControlOptions {
      position?: ControlPosition;
    }
    
    interface ZoomControlOptions {
      position?: ControlPosition;
    }
    
    enum ControlPosition {
      BOTTOM_CENTER,
      BOTTOM_LEFT,
      BOTTOM_RIGHT,
      LEFT_BOTTOM,
      LEFT_CENTER,
      LEFT_TOP,
      RIGHT_BOTTOM,
      RIGHT_CENTER,
      RIGHT_TOP,
      TOP_CENTER,
      TOP_LEFT,
      TOP_RIGHT
    }
    
    enum MapTypeControlStyle {
      DEFAULT,
      DROPDOWN_MENU,
      HORIZONTAL_BAR
    }
    
    enum ScaleControlStyle {
      DEFAULT
    }
    
    class MVCObject {
      addListener(eventName: string, handler: Function): MapsEventListener;
      bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
      get(key: string): any;
      notify(key: string): void;
      set(key: string, value: any): void;
      setValues(values: any): void;
      unbind(key: string): void;
      unbindAll(): void;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
    
    interface Padding {
      bottom: number;
      left: number;
      right: number;
      top: number;
    }
    
    interface LatLng {
      lat(): number;
      lng(): number;
      equals(other: LatLng): boolean;
      toJSON(): LatLngLiteral;
      toString(): string;
      toUrlValue(precision?: number): string;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    interface LatLngBounds {
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toSpan(): LatLng;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }
    
    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }
    
    interface Projection {
      fromLatLngToPoint(latLng: LatLng | LatLngLiteral, point?: Point): Point;
      fromPointToLatLng(pixel: Point, noClampNoWrap?: boolean): LatLng;
    }
    
    class StreetViewPanorama extends MVCObject {
      constructor(container: Element, opts?: StreetViewPanoramaOptions);
    }
    
    interface StreetViewPanoramaOptions {
      addressControl?: boolean;
      addressControlOptions?: StreetViewAddressControlOptions;
      clickToGo?: boolean;
      disableDefaultUI?: boolean;
      disableDoubleClickZoom?: boolean;
      enableCloseButton?: boolean;
      fullscreenControl?: boolean;
      fullscreenControlOptions?: FullscreenControlOptions;
      imageDateControl?: boolean;
      linksControl?: boolean;
      motionTracking?: boolean;
      motionTrackingControl?: boolean;
      motionTrackingControlOptions?: MotionTrackingControlOptions;
      panControl?: boolean;
      panControlOptions?: PanControlOptions;
      pano?: string;
      position?: LatLng | LatLngLiteral;
      pov?: StreetViewPov;
      scrollwheel?: boolean;
      showRoadLabels?: boolean;
      visible?: boolean;
      zoom?: number;
      zoomControl?: boolean;
      zoomControlOptions?: ZoomControlOptions;
    }
    
    interface StreetViewAddressControlOptions {
      position?: ControlPosition;
    }
    
    interface MotionTrackingControlOptions {
      position?: ControlPosition;
    }
    
    interface StreetViewPov {
      heading?: number;
      pitch?: number;
    }
    
    namespace event {
      function addListener(instance: any, eventName: string, handler: Function): MapsEventListener;
      function addDomListener(instance: Element, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
      function clearInstanceListeners(instance: object): void;
      function clearListeners(instance: object, eventName: string): void;
      function removeListener(listener: MapsEventListener): void;
      function trigger(instance: any, eventName: string, ...args: any[]): void;
    }
    
    interface MapMouseEvent {
      latLng?: LatLng;
      stop(): void;
    }
  }

  namespace maps {
    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
    }

    interface GeocoderRequest {
      address?: string;
      location?: LatLng | LatLngLiteral;
      placeId?: string;
      bounds?: LatLngBounds | LatLngBoundsLiteral;
      componentRestrictions?: GeocoderComponentRestrictions;
      region?: string;
    }

    interface GeocoderComponentRestrictions {
      country: string | string[];
      postalCode?: string;
      administrativeArea?: string;
      locality?: string;
      route?: string;
    }

    interface GeocoderResponse {
      results: GeocoderResult[];
      status: GeocoderStatus;
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      place_id: string;
      types: string[];
    }

    interface GeocoderAddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface GeocoderGeometry {
      location: LatLng;
      location_type: GeocoderLocationType;
      viewport: LatLngBounds;
      bounds?: LatLngBounds;
    }

    enum GeocoderLocationType {
      APPROXIMATE,
      GEOMETRIC_CENTER,
      RANGE_INTERPOLATED,
      ROOFTOP
    }

    enum GeocoderStatus {
      ERROR,
      INVALID_REQUEST,
      OK,
      OVER_QUERY_LIMIT,
      REQUEST_DENIED,
      UNKNOWN_ERROR,
      ZERO_RESULTS
    }
  }
}
