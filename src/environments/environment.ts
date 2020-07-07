export const environment = {
  production: false,
  nearbyApiURL: "/api/nearby-departures/{latlong}/300?nextHours=4",
  dataEntryApiURL: "/submission",
  searchApiURL: "/api/search-departures/{term}?routeType={routeType}&pastSeconds={pastSeconds}",
  overrideLocation: true
};