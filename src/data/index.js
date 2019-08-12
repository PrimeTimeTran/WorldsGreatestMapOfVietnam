import Polyline from "@mapbox/polyline";
// Generated using from googlge api
// https://maps.googleapis.com/maps/api/directions/json?origin=10.764570,106.697000&destination=10.762047,106.7075268
let route = require("./schoolroute.json");
const directions = route.routes[0].legs[0];
const points = Polyline.decode(route.routes[0].overview_polyline.points);
route = points.map(point => {
  return [point[1], point[0]];
});

const tripData = {
  start: directions.start_address,
  end: directions.end_address,
  time: directions.duration.text,
  distance: directions.distance.text,
  endLat: directions.end_location.lat,
  endLng: directions.end_location.lng
};

let populationData = require("./csvjson.json");
populationData = populationData.map(pop => {
  return {
    ...pop,
    lat: parseFloat(pop.coords.split(", ")[0].split("° ")[0]),
    long: parseFloat(pop.coords.split(", ")[1].split("° ")[0])
  };
});

// Generated using http://opendata.hcmgis.vn/layers/geonode%3Avietnam_provinces
let provinces = require("./provinces.json");

provinces.features = provinces.features.map((province, idx) => {
  if (province.properties.Name.includes("Province")) {
    const foundPop = populationData.find(pop =>
      province.properties.Name.includes(pop.Name)
    );
    return {
      ...province,
      properties: {
        id: idx + 1,
        ...province.properties,
        ...foundPop
      }
    };
  }

  const foundPop = populationData.find(pop =>
    province.properties.Name.includes(pop.Name)
  );

  return {
    ...province,
    properties: {
      id: idx + 1,
      ...province.properties,
      ...foundPop
    }
  };
});

const dummyData = require("./box.geojson");

export { tripData, route, provinces, populationData, dummyData };
