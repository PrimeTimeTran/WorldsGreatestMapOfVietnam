import React, { Component } from "react";

export default class InfoPanel extends Component {
  render() {
    if (!this.props.isVisible) return <div />;
    return (
      <div className="info-panel-container">
        <h1>Coming Soon</h1>
      </div>
    );
  }
}
