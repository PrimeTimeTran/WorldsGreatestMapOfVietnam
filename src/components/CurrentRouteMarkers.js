import React, { Component } from "react";

import { Marker } from "react-map-gl";

import { route } from "../data";

export default class CurrentRouteMarkers extends Component {
  render() {
    return (
      <div>
        {route.map((point, idx) => {
          console.log("this.props.routeCount", this.props.routeCount);
          if (!(this.props.routeCount * 3 > idx)) return;
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
