import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import ControlPanel from "./components/ControlPanel";
import ProvinceCallout from "./components/ProvinceCallout";
import CurrentRoutePanel from "./components/CurrentRoutePanel";
import CurrentRouteMarkers from "./components/CurrentRouteMarkers";

import "./App.css";

import { route, provinces } from "./data";

export default function App(props) {
  const map = useRef(null);
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
      transitionDuration: 20000,
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

      newMap.addLayer({
        id: "province-fills",
        type: "fill",
        source: "provinces",
        layout: {},
        paint: {
          "fill-color": "#627BC1",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5
          ]
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
    });
  }, []);

  const isHovering = hoveringProvince && hoveringProvince.mouseLat;

  return (
    <>
      <ReactMapGL
        ref={map}
        {...viewport}
        onHover={_onHover}
        onViewportChange={viewport => setViewport(viewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/primetimetran/cjz496fui03pa1dseuakr3f8q"}
      >
        {isHovering && <ProvinceCallout hoveringProvince={hoveringProvince} />}
        <ControlPanel
          onViewportChange={_goToViewport}
          containerComponent={props.containerComponent}
        />
        <CurrentRoutePanel />
        <CurrentRouteMarkers />
      </ReactMapGL>
    </>
  );
}
