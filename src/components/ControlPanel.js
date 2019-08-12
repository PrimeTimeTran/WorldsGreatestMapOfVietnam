import React, { PureComponent } from "react";

const CITIES = [
  {
    city: "Can Tho",
    population: "649,121",
    country: "Vietnam",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Downtown_El_Paso_at_sunset.jpeg/240px-Downtown_El_Paso_at_sunset.jpeg",
    latitude: 10.0452,
    longitude: 105.7469
  },
  {
    city: "Ho Chi Minh City",
    population: "649,121",
    country: "Vietnam",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Downtown_El_Paso_at_sunset.jpeg/240px-Downtown_El_Paso_at_sunset.jpeg",
    latitude: 10.8231,
    longitude: 106.6297
  },
  {
    city: "Da Nang",
    population: "649,121",
    country: "Vietnam",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Downtown_El_Paso_at_sunset.jpeg/240px-Downtown_El_Paso_at_sunset.jpeg",
    latitude: 16.0544,
    longitude: 108.2022
  },
  {
    city: "Hai Phong",
    population: "649,121",
    country: "Vietnam",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Downtown_El_Paso_at_sunset.jpeg/240px-Downtown_El_Paso_at_sunset.jpeg",
    latitude: 20.8449,
    longitude: 106.6881
  },
  {
    city: "Hanoi",
    population: "649,121",
    country: "Vietnam",
    image:
      "http://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Downtown_El_Paso_at_sunset.jpeg/240px-Downtown_El_Paso_at_sunset.jpeg",
    latitude: 21.0278,
    longitude: 105.8342
  }
];

const defaultContainer = ({ children }) => (
  <div className="control-panel">{children}</div>
);

export default class ControlPanel extends PureComponent {
  componentDidMount() {
    // CITIES.map((city, idx) => {
    //   setTimeout(() => {
    //     this.props.onViewportChange(city);
    //   }, 25000 * idx);
    // });
    setTimeout(() => {
      this.props.onViewportChange({ latitude: 10.4114, longitude: 107.1362 });
    }, 5000);
  }

  _renderButton = (city, index) => {
    return (
      <div key={`btn-${index}`} className="input input-container">
        <input
          name="city"
          type="radio"
          className="input"
          id={`city-${index}`}
          defaultChecked={city.city === "San Francisco"}
          onClick={() => this.props.onViewportChange(city)}
        />
        <label htmlFor={`city-${index}`}>{city.city}</label>
      </div>
    );
  };

  render() {
    const Container = this.props.containerComponent || defaultContainer;

    return (
      <div className="points-of-interest-container">
        <Container>
          <h3 className="header">
            Major Cities <i className="fas fa-city" />
          </h3>
          <p>
            Click to learn more <i className="fas fa-chalkboard" />
          </p>
          <hr />
          {CITIES.filter(city => city.country === "Vietnam").map(
            this._renderButton
          )}
        </Container>
      </div>
    );
  }
}
