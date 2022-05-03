import React, { Component } from 'react';
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';


class MapContainer extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number
  };
  constructor(props) {
    super(props);
    const { latitude, longitude } = this.props.geoCoord;
    this.state = {
      lat: latitude || 0,
      lng: longitude || 0,
      zoom: 8
    };
    this.mapRef = React.createRef();
  }

  render() {   
    return (
      <ReactMapGL
        height={400}
        width= "100%"
        latitude={this.state.lat}
        longitude={this.state.lng}
        width={window.innerWidth > 500 ? "100%" : 375}
        zoom={this.state.zoom}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${
          this.props.gmapKey
        }`}        
        scrollZoom={true}
        dragRotate={true}
        onViewportChange={viewport => {
          const { width, height, latitude, longitude, zoom } = viewport;
          this.setState({ zoom, lat: latitude, lng: longitude });
        }}
      >
        <div style={{ position: 'absolute' }}>
          <NavigationControl />
        </div>
        <Marker
          latitude={this.props.geoCoord.latitude}
          longitude={this.props.geoCoord.longitude}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <i className="icon icon-map-marker-primary" />
        </Marker>
      </ReactMapGL>
    );
  }
}

export default MapContainer;
