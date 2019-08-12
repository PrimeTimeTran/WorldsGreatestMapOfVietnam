import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import ControlPanel from "./components/ControlPanel";
import InfoPanel from "./components/InfoPanel";
import ProvinceCallout from "./components/ProvinceCallout";
import CurrentRoutePanel from "./components/CurrentRoutePanel";
import CurrentRouteMarkers from "./components/CurrentRouteMarkers";

import "./App.css";

import { route, provinces, dummyData } from "./data";
import { useInterval } from "./utils";

const apiKey = `key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

export default function App() {
  const map = useRef(null);
  const [end, setEnd] = useState({});
  const [toggledInfoPanel, setToggledInfoPanel] = useState(false);
  const [route, setRoute] = useState({});
  const [start, setStart] = useState({});
  const [routeCount, setRouteCount] = useState(0);
  const [currentRouteData, setCurrentRouteData] = useState({});
  const [hoveringProvince, setHoveringProvince] = useState(false);

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

      // Example of red box to test adding GEOJSON file
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
    const config = {
      method: "GET",
      cache: "no-cache",
      redirect: "follow",
      referrer: "no-referrer",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: "Thanks Charles. #CoderSchool_FTW"
      }
    };

    const origin = `&origin=${startLocation.lat},${startLocation.lng}`;
    const destination = `&destination=${endLocation.lat},${endLocation.lng}`;

    const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?${apiKey}${origin}${destination}`;

    const response = await fetch(url, config);
    const jsonData = await response.json();

    const route = jsonData.routes[0].legs[0];
    setCurrentRouteData(route);

    setRoute(jsonData);
    _goToViewport(
      {
        latitude: route.end_location.lat,
        longitude: route.end_location.lng
      },
      35000
    );
  };

  const onSearchRoute = async (start, end) => {
    let startLocation;
    let endLocation;

    let response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${apiKey}&address=${start}`
    );
    let jsonData = await response.json();
    if (jsonData.results && jsonData.results.length > 0) {
      startLocation = {
        name: jsonData.results[0].formatted_address,
        lat: jsonData.results[0].geometry.location.lat,
        lng: jsonData.results[0].geometry.location.lng
      };
      setStart(startLocation);
    }

    response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${apiKey}&address=${end}`
    );
    jsonData = await response.json();
    if (jsonData.results && jsonData.results.length > 0) {
      endLocation = {
        name: jsonData.results[0].formatted_address,
        lat: jsonData.results[0].geometry.location.lat,
        lng: jsonData.results[0].geometry.location.lng
      };
      setEnd(endLocation);
    }
    getDirections(startLocation, endLocation);
  };

  const clearRouteData = () => {
    setCurrentRouteData({});
    setRoute({});
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
        mapStyle={"mapbox://styles/primetimetran/cjz496fui03pa1dseuakr3f8q"}
      >
        {isHovering && <ProvinceCallout hoveringProvince={hoveringProvince} />}

        <CurrentRoutePanel
          onSearchRoute={onSearchRoute}
          currentRouteData={currentRouteData}
          clearRoute={clearRouteData}
        >
          <ControlPanel
            onViewportChange={_goToViewport}
            currentRouteData={currentRouteData}
            toggle={() => setToggledInfoPanel(!toggledInfoPanel)}
          />
        </CurrentRoutePanel>
        <CurrentRouteMarkers routeCount={routeCount} route={route} />
        <InfoPanel
          isVisible={toggledInfoPanel}
          toggle={() => setToggledInfoPanel(!toggledInfoPanel)}
        />
      </ReactMapGL>
    </>
  );
}
