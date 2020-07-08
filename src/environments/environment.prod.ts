export const environment = {
  production: true,
  nearbyApiURL: "/api/nearby-departures/{latlong}/{distance}?nextSeconds={nextSeconds}&pastSeconds={pastSeconds}",
  dataEntryApiURL: "/submission",
  searchApiURL: "/api/search-departures/{term}?routeType={routeType}&pastSeconds={pastSeconds}",
  stopsApiURL: "/api/stops/route/{route_id}/{route_type}",
  overrideLocation: false
};