import React from 'react';
import { SiderState, useMapContext } from "../../context/MapContext";
import RouteSider from "./RouteSider/RouteSider";
import EditSider from "./EditSider/EditSider";

const MapSider = () => {

    const {siderState} = useMapContext();

    if (siderState === SiderState.LIST) {
        return <RouteSider />
    }
    else {
        return <EditSider createMode={siderState === SiderState.CREATE}/>
    }
}

export default MapSider;
