import React, { Component, useState } from "react";

import { tripData } from "../data";

export default class CurrentRoutePanel extends Component {
  state = {
    start: "",
    end: ""
  };
  componentDidMount() {
    this.nameInput.focus();
  }
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
          <input
            ref={input => {
              this.nameInput = input;
            }}
            onChange={e => this.setState({ start: e.target.value })}
          />
          <hr />
          <p>{tripData.start}</p>
        </div>
        <div className="card-field">
          <h5>
            End <i className="fa fa-map-pin" />
          </h5>
          <input onChange={e => this.setState({ end: e.target.value })} />
          <hr />
          <p>{tripData.end}</p>
        </div>
        <button
          onClick={() =>
            this.props.onSearchRoute(this.state.start, this.state.end)
          }
        >
          Search
        </button>
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
