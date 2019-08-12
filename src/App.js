import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import ControlPanel from "./components/ControlPanel";
import ProvinceCallout from "./components/ProvinceCallout";
import CurrentRoutePanel from "./components/CurrentRoutePanel";
import CurrentRouteMarkers from "./components/CurrentRouteMarkers";

import "./App.css";

import { route, provinces, dummyData } from "./data";
import { useInterval } from "./utils";

export default function App() {
  const map = useRef(null);
  const [hoveringProvince, setHoveringProvince] = useState(false);
  const [routeCount, setRouteCount] = useState(0);
  const [start, setStart] = useState({});
  const [end, setEnd] = useState({});
  const [route, setRoute] = useState({});

  useInterval(() => setRouteCount(routeCount + 1), 1000);

  const [viewport, setViewport] = useState({
    zoom: 13,
    width: "100vw",
    height: "100vh",
    latitude: 10.7696661,
    longitude: 106.6991565
  });

  const setupApp = () => {
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

      // Route to destination
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
          "line-color": "red",
          "line-width": 4
        }
      });

      // newMap.addSource("slsls", {
      //   type: "geojson",
      //   data: dummyData
      // });

      // newMap.addLayer({
      //   id: "provdwqwd",
      //   type: "fill",
      //   source: "slsls",
      //   paint: {
      //     "fill-color": "red",
      //     "fill-opacity": [
      //       "case",
      //       ["boolean", ["feature-state", "hover"], false],
      //       1,
      //       0.5
      //     ]
      //   }
      // });
    });
  };

  useEffect(() => {
    setupApp();
  }, []);

  const _goToViewport = ({ longitude, latitude }, length) => {
    setViewport({
      zoom: 13,
      latitude,
      longitude,
      transitionDuration: length || 25000,
      transitionInterpolator: new FlyToInterpolator()
    });
  };

  const _onHover = event => {
    const { features } = event;

    const isHoveringProvince =
      features &&
      features.length > 0 &&
      features[0].properties.hasOwnProperty("Name") &&
      event.lngLat[0] &&
      event.lngLat[1];

    if (isHoveringProvince) {
      setHoveringProvince({
        ...features[0].properties,
        mouseLat: event.lngLat[1] - 0.0009,
        mouselong: event.lngLat[0] + 0.0009
      });
    } else {
      setHoveringProvince(null);
    }
  };

  const getDirections = async (startLocation, endLocation) => {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyCIVfRN6v7V0E0-qW3jb-kjG7ky76aPU04&origin=${
        startLocation.lat
      },${startLocation.lng}&destination=${endLocation.lat},${endLocation.lng}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          Origin: "Loi is a dumbass"
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client
      }
    )
      .then(res => {
        return res.json();
      })
      .then(jsonData => {
        console.log("lalalal", jsonData);
        setRoute(jsonData);
      });
  };

  const onSearchRoute = async (start, end) => {
    let startLocation;
    let endLocation;

    let response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCIVfRN6v7V0E0-qW3jb-kjG7ky76aPU04&address=${start}`
      // `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCIVfRN6v7V0E0-qW3jb-kjG7ky76aPU04&address=HCMC,Vietnam`
    );
    let jsonData = await response.json();
    if (jsonData.results && jsonData.results.length > 0) {
      startLocation = {
        name: jsonData.results[0].formatted_address,
        lat: jsonData.results[0].geometry.location.lat,
        lng: jsonData.results[0].geometry.location.lng
      };
      console.log("startLocation", startLocation);
      setStart(startLocation);
    }

    response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCIVfRN6v7V0E0-qW3jb-kjG7ky76aPU04&address=${end}`
      // `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCIVfRN6v7V0E0-qW3jb-kjG7ky76aPU04&address=NhaTrang,Vietnam`
    );
    jsonData = await response.json();
    if (jsonData.results && jsonData.results.length > 0) {
      endLocation = {
        name: jsonData.results[0].formatted_address,
        lat: jsonData.results[0].geometry.location.lat,
        lng: jsonData.results[0].geometry.location.lng
      };
      console.log("endLocation", endLocation);
      setEnd(endLocation);
    }
    getDirections(startLocation, endLocation);
  };

  const isHovering = hoveringProvince && hoveringProvince.mouseLat;
  return (
    <>
      <ReactMapGL
        ref={map}
        {...viewport}
        onHover={_onHover}
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/primetimetran/cjz496fui03pa1dseuakr3f8q"} // Decimal
        // mapStyle={"mapbox://styles/primetimetran/cjz7875ka1m121cr6q2mk4mra"} // Dark
        // mapStyle={"mapbox://styles/primetimetran/cjz785g0d1lzj1cr60k3qzv1y"} // Google Maps
      >
        {isHovering && <ProvinceCallout hoveringProvince={hoveringProvince} />}
        <ControlPanel onViewportChange={_goToViewport} />
        <CurrentRoutePanel onSearchRoute={onSearchRoute} />
        <CurrentRouteMarkers routeCount={routeCount} route={route} />
      </ReactMapGL>
    </>
  );
}
