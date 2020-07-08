export const environment = {
  production: true,
  nearbyApiURL: "/api/nearby-departures/{latlong}/{distance}?nextHours={nextHours}&pastHours={pastHours}",
  dataEntryApiURL: "/submission",
  searchApiURL: "/api/search-departures/{term}?routeType={routeType}",
  stopsApiURL: "/api/stops/route/{route_id}/{route_type}",
  overrideLocation: false
};