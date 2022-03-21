import React, { FC, useEffect, useState } from "react";
import './EditSider.css';
import { Button, Input, Layout, List, Radio } from 'antd';
import { EditorMode, SiderState, useMapContext } from "../../../context/MapContext";
import { DeleteOutlined, FormOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { CirclePicker } from 'react-color'
import { IRoute } from "../../../interfaces/route";

const { Sider } = Layout;

export interface IEditSider {
    createMode: boolean;
}

const EditSider: FC<IEditSider> = ({ createMode }) => {
    const {
        routes,
        routesLoading,
        saveChanges,
        addRoute,
        editRoute,
        setEditRoute,
        setSiderState,
        editorMode,
        setEditorMode,
        editColor,
        setEditColor
    } = useMapContext();

    const [routeName, setRouteName] = useState("");

    const cancelClicked = () => {
        setSiderState(SiderState.LIST);
        setRouteName("");
        setEditColor({ r: 0, g: 0, b: 0 });
        setEditRoute({
            _id: "",
            name: "",
            color: { r: 0, b: 0, g: 0 },
            points: []
        });
    }


    return <Sider width={300} className={'editSider'}>
        <div className={'header'}>
            <p className={'title'}>{createMode ? 'New Route' : 'Edit Route'}</p>
        </div>
        <div className={'content'}>
            <Input placeholder={'Route Name'} value={editRoute.name} onChange={(e) => setEditRoute((cur) => {
                return { ...cur, name: e.target.value }
            })}/>
            <br/><br/>
            <Radio.Group buttonStyle="solid" value={editorMode} onChange={(e) => setEditorMode(e.target.value)}>
                <Radio.Button value={EditorMode.CREATE}><PlusSquareOutlined/></Radio.Button>
                <Radio.Button value={EditorMode.EDIT}><FormOutlined/></Radio.Button>
                <Radio.Button value={EditorMode.DELETE}><DeleteOutlined/></Radio.Button>
            </Radio.Group><br/><br/>

            <div style={{ textAlign: 'center', width: 'fit-content', marginLeft: 20 }}>
                <CirclePicker color={editRoute.color} onChange={(e) => {
                    setEditRoute((cur) => {
                        return { ...cur, color: e.rgb }
                    })
                }}/>
            </div>

            <br/>
            <List
                style={{ height: 525, maxHeight: 525, overflowY: 'auto' }}
                bordered
                loading={routesLoading}
                dataSource={editRoute ? editRoute.points : []}
                renderItem={(item, index) => (
                    <List.Item style={{ padding: 10, textAlign: 'left' }}>
                        <b>{`Pin ${index + 1}`}</b>
                        <br/>
                        {`Lat: ${item.lat}`}
                        <br/>
                        {`Lng: ${item.lng}`}
                    </List.Item>
                )}
            />
        </div>
        <div className={'footer'}>
            <Button onClick={cancelClicked}>Cancel</Button>
            <Button type={'primary'} onClick={() => {
                if (createMode) {
                    addRoute(editRoute)
                } else {
                    saveChanges(editRoute);
                }

                setEditRoute({
                    _id: "",
                    name: "",
                    color: { r: 0, b: 0, g: 0 },
                    points: []
                });
            }}>{createMode ? 'Create' : 'Save'}</Button>
        </div>
    </Sider>
}
export default EditSider;
