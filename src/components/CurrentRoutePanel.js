import React, { Component } from "react";

export default class CurrentRoutePanel extends Component {
  state = {
    start: "HCMC, Vietnam",
    end: "Nha Trang, Vietnam"
  };
  componentDidMount() {
    this.nameInput.focus();
  }
  keyPress = e => {
    if (e.keyCode === 13) {
      this.props.onSearchRoute(this.state.start, this.state.end);
    }
  };
  render() {
    const {
      duration = {},
      distance = {},
      end_address = "",
      start_address = ""
    } = this.props.currentRouteData;

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
            className="route-input"
            placeholder="HCMC, Vietnam"
            value={this.state.start}
            onChange={e => this.setState({ start: e.target.value })}
            ref={input => {
              this.nameInput = input;
            }}
          />
          <hr />
          <p>{start_address}</p>
        </div>
        <div className="card-field">
          <h5>
            End <i className="fa fa-map-pin" />
          </h5>
          <input
            className="route-input"
            value={this.state.end}
            placeholder="Nha Trang, Vietnam"
            onKeyDown={this.keyPress}
            onChange={e => {
              this.setState({ end: e.target.value });
            }}
          />
          <hr />
          <p>{end_address}</p>
          <div className="button-container">
            <button
              className="search-button"
              onClick={() =>
                this.props.onSearchRoute(this.state.start, this.state.end)
              }
            >
              Search
            </button>
            <button onClick={() => this.props.clearRoute()}>Clear</button>
          </div>
        </div>

        <div className="card-field">
          <h5>
            Time <i className="fa fa-clock-o" />
          </h5>
          <hr />
          <p>{duration.text}</p>
        </div>
        <div className="card-field">
          <h5>
            Distance <i className="fa fa-location-arrow" />
          </h5>
          <hr />
          <p>{distance.text}</p>
        </div>
        {this.props.children}
      </div>
    );
  }
}
