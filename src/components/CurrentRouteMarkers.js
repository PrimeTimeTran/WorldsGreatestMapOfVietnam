import React, { Component } from "react";
import Polyline from "@mapbox/polyline";

import { Marker } from "react-map-gl";

import { route as defaultRoute } from "../data";

export default class CurrentRouteMarkers extends Component {
  render() {
    let route = null;
    if (this.props.route.routes !== undefined) {
      const points = Polyline.decode(
        this.props.route.routes[0].overview_polyline.points
      );
      route = points.map(point => {
        return [point[1], point[0]];
      });
    }
    const finalRoute = route || defaultRoute;
    return (
      <div>
        {finalRoute.map((point, idx) => {
          // if (!(this.props.routeCount * 3 > idx)) return;
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
      </div>
    );
  }
}
