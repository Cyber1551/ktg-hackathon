import React from 'react';
import './MapScreen.css';
// @ts-ignore
import { LatLng, MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { SiderState, useMapContext } from "../../context/MapContext";
import RouteDisplay from "../../components/RouteDisplay/RouteDisplay";

const MapScreen = () => {
    const position = { lat: 27.851992, lng: -97.227813 };
    const {routes, siderState} = useMapContext();

    const displayAllRoutes = () => {

        return <>
            {routes.map((route, index) => {
                if (!route.visible) return <></>
                return route.points?.map((point, index2) => {
                    if (point) {
                        return <Marker key={`${index}|${index2}`} position={point} />
                    }
                    else {
                        return <></>
                    }
                })
            })}
            {routes.map((route, index) => {
                if (!route.visible) return <></>
                if (route.points && route.color) {
                    const color = route.color;
                    return <Polyline key={index} positions={route.points} pathOptions={{color: `rgb(${color.r}, ${color.g}, ${color.b})`}} />
                }
                else {
                    return <></>
                }
            })}
        </>
    }

    return <div className={'mapScreen'}>
        <MapContainer center={position} zoom={20} style={{flex: 1, flexShrink: 0}}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
                url="https://public_tiles.dronedeploy.com/v1/tiles_images/617c30c02245dfe3ad415c58/orthomosaic/{z}/{x}/{y}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjIxNDU5MTY4MDAwMDAsInVzZXJuYW1lIjoia3RnLmRyb25lZGVwbG95MUBraWV3aXQuY29tIiwicGxhbl9pZCI6IjYxN2MzMGMwMjI0NWRmZTNhZDQxNWM1OCIsImxheWVyIjoib3J0aG9tb3NhaWMifQ.KbUTE9OAGsv4avkUxPWdNk93yqmIbxffU117pEoLWYxBcYriRxV8Pit_MW2bQyarLYWh6bcF_JJfI0hnChCrRQ"
            />
            {siderState === SiderState.LIST ? displayAllRoutes() : <RouteDisplay />}
        </MapContainer>
    </div>
}

export default MapScreen;
