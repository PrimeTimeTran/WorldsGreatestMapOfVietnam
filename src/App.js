import React, { useState, useEffect, useRef } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import ControlPanel from "./ControlPanel";

import "./App.css";
import { tripData, route, provinces } from "./data";

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
      transitionDuration: 20000,
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
            className="marker"
            latitude={hoveringProvince.mouseLat}
            longitude={hoveringProvince.mouselong}
          >
            <div className="description-container">
              <span className="description-header">
                <i className="fa fa-map icon" />
                {hoveringProvince.Name} (2017 <i class="fas fa-chart-line" />)
              </span>
              <hr />
              <br />
              <i className="fa fa-group icon" />
              {(hoveringProvince.pop2017 * 1000)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Marker>
        )}
        <div className="points-of-interest-container">
          <ControlPanel
            onViewportChange={_goToViewport}
            containerComponent={props.containerComponent}
          />
        </div>
        <div className="directions-container">
          <h5>
            Current Trip <i className="fa fa-compass" />
          </h5>
          <hr />
          <div className="card-field">
            <h5>
              Start <i className="fa fa-map-pin" />
            </h5>
            <hr />
            <p>{tripData.start}</p>
          </div>
          <div className="card-field">
            <h5>
              End <i className="fa fa-map-pin" />
            </h5>
            <hr />
            <p>{tripData.end}</p>
          </div>
          <div className="card-field">
            <h5>
              Time <i className="fa fa-clock-o" />
            </h5>
            <hr />
            <p>{tripData.time}</p>
          </div>
          <div className="card-field">
            <h5>
              Distance <i className="fa fa-location-arrow" />
            </h5>
            <hr />
            <p>{tripData.distance}</p>
          </div>
        </div>
        {route.map(point => {
          return (
            <Marker latitude={point[1]} longitude={point[0]}>
              <button
                className="marker-btn"
                onClick={e => {
                  console.log("e");
                  e.preventDefault();
                }}
              >
                <img src="/skateboarding.svg" alt="Skate Park Icon" />
              </button>
            </Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
}
