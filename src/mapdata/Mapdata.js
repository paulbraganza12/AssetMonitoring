import React, { Component } from 'react';
import './Mapdata.css';
import { withScriptjs, withGoogleMap, GoogleMap, Polyline } from "react-google-maps";
import GoogleMapLoader from "react-google-maps-loader"

const MapWithAMarker = withScriptjs(withGoogleMap(props => {
    //console.log("MapWithAMarker",props.polyline);
    var a, b;
    if (props.polyline.length !== 0) {
        a = props.polyline[props.polyline.length - 1];
        b = 8;
    }
    else {
        a = { lat: 19.839014, lng: 75.255607 };
        b = 5;
    }
    return (
        <GoogleMap zoom={b} center={a}>
            <Polyline path={props.polyline} geodesic={true} options={{ strokeColor: '#ff2527', strokeWeight: 4, }} />
        </GoogleMap>
    )

}));

class Mapdata extends Component {
    constructor(props) {
        super(props);
        this.state = { jsonp: [] };
    }


    componentWillReceiveProps(nextProps) {
        //console.log("nextprops",nextProps.polyline);
        this.setState({ jsonp: nextProps.polyline })
        //this.nextProps;
        //console.log(nextProps);
    }
    render() {


        return (
            <div>
                <div className="parentMap">
                    <div className="top"></div>

                    <MapWithAMarker
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=--API KEY --"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `490px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        polyline={this.state.jsonp}
                    />

                </div>
            </div>

        )
    }
}

export default Mapdata;