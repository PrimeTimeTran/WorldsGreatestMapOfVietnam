import React, { Component } from "react";
import { Marker } from "react-map-gl";

export default class ProvinceCallout extends Component {
  render() {
    const { hoveringProvince } = this.props;
    return (
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
    );
  }
}
