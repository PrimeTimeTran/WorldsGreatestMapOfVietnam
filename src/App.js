import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import Polyline from "@mapbox/polyline";

import "mapbox-gl/dist/mapbox-gl.css";

import ControlPanel from "./ControlPanel";

import "./App.css";

// Generated using from googlge api
// https://maps.googleapis.com/maps/api/directions/json?origin=10.764570,106.697000&destination=10.762047,106.7075268&key=AIzaSyAoRQzDCdlCdi_vjImbRTKu_LX5sg8Zzs0
let route = require("./data/schoolroute.json");
const directions = route.routes[0].legs[0];
const points = Polyline.decode(route.routes[0].overview_polyline.points);
route = points.map(point => [point[1], point[0]]);

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
let provinces = require("./data/provinces.json");

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

export default function App(props) {
  const map = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [hoveringProvince, setHoveringProvince] = useState(false);

  const [viewport, setViewport] = useState({
    zoom: 13,
    width: "100vw",
    height: "100vh",
    latitude: 10.7696661,
    longitude: 106.6991565
  });

  const _goToViewport = ({ longitude, latitude }) => {
    setViewport({
      zoom: 13,
      latitude,
      longitude,
      transitionDuration: 60000,
      transitionInterpolator: new FlyToInterpolator()
    });
  };

  const _onHover = event => {
    const { features } = event;

    if (
      features &&
      features.length > 0 &&
      features[0].properties.hasOwnProperty("Name") &&
      event.lngLat[0] &&
      event.lngLat[1]
    ) {
      setHovering(true);
      setHoveringProvince({
        ...features[0].properties,
        mouseLat: event.lngLat[1] - 0.0009,
        mouselong: event.lngLat[0] + 0.0009
      });
    } else {
      setHovering(false);
      setHoveringProvince(null);
    }
  };

  useEffect(() => {
    const newMap = map.current.getMap();
    newMap.on("load", () => {
      // All Provinces
      newMap.addSource("provinces", {
        type: "geojson",
        data: provinces
      });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      newMap.addLayer({
        id: "province-fills",
        type: "fill",
        source: "provinces",
        paint: {
          "fill-color": "#4392F1",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5
          ]
        }
      });

      newMap.addLayer({
        id: "province-borders",
        type: "line",
        source: "provinces",
        layout: {},
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 2
        }
      });

      // Route to school
      newMap.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: route
            }
          }
        },
        layout: {
          "line-join": "round",
          "line-cap": "round"
        },
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 4
        }
      });
    });
  }, []);

  return (
    <div>
      <ReactMapGL
        ref={map}
        {...viewport}
        onHover={_onHover}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/primetimetran/cjz496fui03pa1dseuakr3f8q"}
      >
        {hovering && hoveringProvince && hoveringProvince.mouseLat && (
          <Marker
            latitude={hoveringProvince.mouseLat}
            longitude={hoveringProvince.mouselong}
          >
            <div
              style={{
                width: 250,
                padding: 10,
                height: 100,
                color: "white",
                borderRadius: 20,
                backgroundColor: "rgba(52, 52, 52, 0.8)"
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: 25 }}>
                {hoveringProvince.Name}
              </span>
              <br />
              {(hoveringProvince.pop2017 * 1000)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Marker>
        )}
        <div
          style={{
            left: 0,
            zIndex: 1,
            bottom: 0,
            width: 300,
            height: 200,
            padding: 20,
            position: "absolute",
            backgroundColor: "#4392F1"
          }}
        >
          <ControlPanel
            onViewportChange={_goToViewport}
            containerComponent={props.containerComponent}
          />
        </div>
        <div
          style={{
            left: 0,
            top: 0,
            width: 300,
            height: 250,
            zIndex: 1,
            padding: 20,
            position: "absolute",
            backgroundColor: "red"
          }}
        >
          <h3>Current Trip:</h3>
          <hr />
          <h5>Start: {tripData.start}</h5>
          <h5>End: {tripData.end}</h5>
          <h5>Time: {tripData.time}</h5>
          <h5>Distance: {tripData.distance}</h5>
        </div>
        {/* {populationData.map(pop => {
          return (
            <Marker latitude={pop.lat} longitude={pop.long}>
              <button
                className="marker-btn"
                onClick={e => {
                  e.preventDefault();
                }}
              >
                <img src="/skateboarding.svg" alt="Skate Park Icon" />
              </button>
            </Marker>
          );
        })} */}
        {route.map(point => (
          <Marker latitude={point[1]} longitude={point[0]}>
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
              }}
            >
              <img src="/skateboarding.svg" alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}
        }
      </ReactMapGL>
    </div>
  );
}
