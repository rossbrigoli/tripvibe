export const environment = {
  production: true,
  nearbyApiURL: "/api/nearby-departures/{latlong}/{distance}?nextHours={nextHours}&pastHours={pastHours}",
  dataEntryApiURL: "/submission",
  searchApiURL: "/api/search-departures/{term}?routeType={routeType}",
  overrideLocation: false
};