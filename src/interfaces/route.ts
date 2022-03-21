// @ts-ignore
import { LatLng } from "react-leaflet";
import { RGBColor } from "react-color";


export interface IPoint {
    position: LatLng;
}


export interface IRoute {
    _id?: string;
    points: LatLng[];
    name: string;
    color: RGBColor;
}

export interface IRouteListItem extends IRoute {
    visible: boolean;
}
