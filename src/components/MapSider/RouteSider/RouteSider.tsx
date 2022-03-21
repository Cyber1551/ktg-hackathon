import React, { useState } from "react";
import './RouteSider.css';
import { Button, Input, Layout, List, Popconfirm, Tooltip } from 'antd';
import {
    DeleteOutlined,
    DownloadOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    FormOutlined,
    PlusOutlined
} from '@ant-design/icons'
import { SiderState, useMapContext } from "../../../context/MapContext";
import { IRoute } from "../../../interfaces/route";
// @ts-ignore
import { LatLng } from "react-leaflet";

const { Sider } = Layout;

const RouteSider = () => {
    const { routes, routesLoading, setSiderState, routeVisible, deleteRoute, setEditRoute } = useMapContext();
    const [filter, setFilter] = useState<string>("");

    const convertLngLat = (latlng: LatLng) => {
        const ret: number[] = [latlng.lng, latlng.lat];
        return ret;
    }
    const convertToLatLngArray = (arr: LatLng[][]) => {
        const points = arr.map((point) => {
            return point.map((coord) => {
                return convertLngLat(coord);
            })
        })
        return points;
    }

    const convertToLineSegmentArray = (arr: LatLng[]) => {
        const output = new Array(arr.length - 1);
        for (let i = 0; i < arr.length - 1; ++i) {
            output[i] = [arr[i], arr[i + 1]];
        }
        const segments = convertToLatLngArray(output);
        return segments;
    }

    const convertToGeoJson = () => {
        let obj = {
            type: "FeatureCollection",
            features: routes.filter((route) => route.visible === true).map((route) => {
                return {
                    type: "Feature",
                    properties: {
                        Name: route.name
                    },
                    geometry: {
                        type: "MultiLineString",
                        coordinates: convertToLineSegmentArray(route.points)

                    }
                }
            })

        }
        return JSON.stringify(obj);
    }

    const downloadGeo = () => {
        const geo = convertToGeoJson()

        if (geo) {
            const blob = new Blob([geo], {type: 'applicaition/json'});
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = 'geoExport.geojson';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const startDeleteRoute = (route: IRoute) => {
        deleteRoute(route);
    }
    const startEditRoute = (route: IRoute) => {
        setEditRoute(route);
        setSiderState(SiderState.EDIT);
    }

    return <Sider width={300} className={'routeSider'}>
        <div className={'header'}>
            <p className={'title'}>Routes</p>
            <Tooltip title={'New Route'} placement={'bottomRight'}>
                <Button shape={'circle'} icon={<PlusOutlined/>} type={'primary'}
                        onClick={() => setSiderState(SiderState.CREATE)}/>
            </Tooltip>
        </div>
        <div className={'routeList'}>
            <List
                style={{ height: '100%' }}
                bordered
                header={<div style={{ display: 'inline-flex', gap: 5, width: '100%' }}><Input placeholder={'Filter'}
                                                                                              style={{ flex: 4 }}
                                                                                              value={filter}
                                                                                              onChange={(e) => setFilter(e.target.value)}/><Button
                    onClick={downloadGeo} style={{ flex: 1 }} icon={<DownloadOutlined/>}/></div>}
                loading={routesLoading}
                dataSource={filter.length > 0 ? routes.filter((v) => v.name.toLowerCase().includes(filter.toLowerCase())) : routes}
                renderItem={(item, index) => (
                    <List.Item style={{ padding: 10 }}>
                        <List.Item.Meta avatar={<Button icon={item.visible ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                                                        type={'ghost'} style={{ border: 'none' }} onClick={() => {
                            routeVisible(index, !item.visible)
                        }}/>} title={<span
                            style={{ color: `rgb(${item.color.r}, ${item.color.g}, ${item.color.b})` }}>{item.name}</span>}/>
                        <Button icon={<FormOutlined/>} type={'ghost'} style={{ marginRight: 10 }} onClick={() => startEditRoute(item)} />
                        <Popconfirm placement={'right'} title={"Are you sure you want to delete?"} onConfirm={() => startDeleteRoute(item)}><Button icon={<DeleteOutlined/>} danger={true} type={'primary'} /></Popconfirm>
                    </List.Item>
                )}
            />
        </div>
    </Sider>
}
export default RouteSider;
