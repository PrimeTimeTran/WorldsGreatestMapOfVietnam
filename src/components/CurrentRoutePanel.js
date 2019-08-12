import React, { Component } from "react";
import { CSSTransitionGroup } from "react-transition-group"; // ES6

export default class CurrentRoutePanel extends Component {
  state = {
    start: "",
    end: ""
  };
  componentDidMount() {
    this.nameInput.focus();
  }
  keyPress = e => {
    if (e.keyCode === 13 || e.keyCode === undefined) {
      const isAbleToSubmit = this.state.start.length > 1 && this.state.end;
      if (isAbleToSubmit) {
        this.props.onSearchRoute(this.state.start, this.state.end);
      }
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
        <CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          className="TodoContainer"
        >
          <div>
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
                value={this.state.start}
                placeholder="&#xf041; HCMC, Vietnam"
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
                onKeyDown={this.keyPress}
                placeholder="&#xf041; Nha Trang, Vietnam"
                onChange={e => {
                  this.setState({ end: e.target.value });
                }}
              />
              <hr />
              <p>{end_address}</p>
              <div className="button-container">
                <button
                  className="search-button"
                  onClick={e =>
                    // this.props.onSearchRoute(this.state.start, this.state.end)
                    this.keyPress(e)
                  }
                >
                  Search{" "}
                  <i className="fa fa-search" style={{ color: "white" }} />
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
          </div>
          <div className="">{this.props.children}</div>
        </CSSTransitionGroup>
      </div>
    );
  }
}
