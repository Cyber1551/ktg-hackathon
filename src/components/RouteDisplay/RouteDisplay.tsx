import React, { useCallback, useEffect, useState } from "react";
// @ts-ignore
import { CircleMarker, LatLng, Marker, Polyline, useMapEvent } from "react-leaflet";
import { LeafletMouseEvent, PathOptions } from "leaflet";
import { EditorMode, SiderState, useMapContext } from "../../context/MapContext";
import DraggableMarker from "../DraggableMarker/DraggableMarker";

const RouteDisplay = () => {

    const {routes, editRoute, setEditRoute, editorMode, siderState, editColor} = useMapContext();

    const [pathOptions, setPathOptions] = useState<PathOptions>({});
    const getDistance = (point1: LatLng, point2: LatLng) => {
        const R = 6371e3;
        const theta1 = point1.lat * Math.PI/180;
        const theta2 = point2.lat * Math.PI/180;

        const deltaLat = (point2.lat - point1.lat);
        const deltaLng = (point2.lng - point1.lng);

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat / 2) + Math.cos(theta1) * Math.cos(theta2) * Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        return d;
    }

    const split = (coord: LatLng, prev: LatLng) => {
        let distance = getDistance(prev, coord);
        if (distance > 15000) {

        }
    }
    const onMapClick = useCallback((e: LeafletMouseEvent) => {
        if (editorMode !== EditorMode.CREATE) return;
        setEditRoute((cur) => {
            return {...cur, points: [...cur.points, e.latlng]};
        })
    }, [editorMode])

    useMapEvent('click', onMapClick);

    useEffect(() => {
        setPathOptions({
            color: `rgb(${editRoute.color.r}, ${editRoute.color.g}, ${editRoute.color.b})`
        })
    }, [editRoute.color]);

    const createObjects = () => {
        if (!editRoute) return <></>
        return <>
            {editRoute.points.map((er, index) => {
                return <DraggableMarker key={index} position={er} index={index} setPosition={(newPos:LatLng, ii) => {
                    setEditRoute((cur) => {
                        let copy = [...cur.points];
                        copy[ii] = newPos;
                        return {...cur, points: copy};
                    })
                }} draggable={editorMode === EditorMode.EDIT} removable={editorMode === EditorMode.DELETE} onRemove={(ii) => {
                    setEditRoute((cur) => {
                        return {...cur, points: cur.points.filter((v, i) => i !== ii)};
                    })
                }} onClickCreate={(position => {
                    setEditRoute((cur) => {
                        return {...cur, points: [...cur.points, position]};
                    })
                })}/>
            })}
            {<Polyline pathOptions={pathOptions} positions={editRoute.points} />}
        </>
    }

    return siderState !== SiderState.LIST ? createObjects() : <></>;

}
export default RouteDisplay;
