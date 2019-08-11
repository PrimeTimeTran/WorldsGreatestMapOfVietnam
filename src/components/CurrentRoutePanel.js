import React, { Component } from "react";

import { tripData } from "../data";

export default class CurrentRoutePanel extends Component {
  render() {
    return (
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
    );
  }
}
