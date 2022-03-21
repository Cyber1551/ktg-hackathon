import { FC, useEffect, useMemo, useRef } from 'react'
// @ts-ignore
import { LatLng, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { EditorMode, useMapContext } from "../../context/MapContext";

export interface IDraggableMarker {
    position: LatLng;
    setPosition: (newPos: LatLng, index: number) => void;
    draggable?: boolean;
    index: number;
    onRemove: (index: number) => void;
    removable?: boolean;
    onClickCreate: (position:LatLng) => void;
}

const DraggableMarker:FC<IDraggableMarker> = ({position, setPosition, draggable, removable, index, onRemove, onClickCreate}) => {
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            click() {
                const marker = markerRef.current;
                if (marker != null) {
                    if (removable) {
                        onRemove(index);
                    }
                    else if (!draggable) {
                        onClickCreate(position);
                    }
                }
            },
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    // @ts-ignore
                    setPosition(marker.getLatLng(), index)
                }
            },
        }),
        [removable, draggable],
    )

    return (
        <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}>
        </Marker>
    )
}

export default DraggableMarker;
