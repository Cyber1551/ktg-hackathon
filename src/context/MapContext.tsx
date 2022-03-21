import React, { Dispatch, ReactElement, useCallback, useContext, useEffect, useState } from "react";
import { IRoute, IRouteListItem } from "../interfaces/route";
import { createRoute, getAllRoutes, removeRoute, updateRoute } from "../api";
import { RGBColor } from "react-color";
// @ts-ignore
import { LatLng } from "react-leaflet";

export enum SiderState {
    LIST,
    CREATE,
    EDIT
}

export enum EditorMode {
    CREATE,
    EDIT,
    DELETE,
}

export interface IMapContext {
    routes: IRouteListItem[];
    routesLoading: boolean;
    siderState: SiderState;
    setSiderState: Dispatch<React.SetStateAction<SiderState>>;

    editorMode: EditorMode;
    setEditorMode: Dispatch<React.SetStateAction<EditorMode>>;
    editColor: RGBColor;
    setEditColor: Dispatch<React.SetStateAction<RGBColor>>;

    editRoute: IRoute;
    setEditRoute: Dispatch<React.SetStateAction<IRoute>>;
    addRoute: Function;
    routeVisible: Function;
    deleteRoute: Function;
    saveChanges: Function;
}

const MapContext = React.createContext<IMapContext>({
    routes: [],
    routesLoading: false,
    siderState: SiderState.LIST,
    setSiderState: () => {
    },
    editorMode: EditorMode.CREATE,
    setEditorMode: () => {
    },
    editColor: { r: 0, b: 0, g: 0 },
    setEditColor: () => {
    },
    editRoute: {
        name: "",
        color: {r: 0, b: 0, g: 0},
        points: []
    },
    setEditRoute: () => {
    },
    addRoute: () => {},
    routeVisible: () => {},
    deleteRoute: () => {},
    saveChanges: () => {}
});

export const MapProvider = (props: { children: ReactElement }) => {
    const [routes, setRoutes] = useState<IRouteListItem[]>([]);
    const [routesLoading, setRoutesLoading] = useState<boolean>(false);
    const [siderState, setSiderState] = useState<SiderState>(SiderState.LIST);
    const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.CREATE);
    const [editRoute, setEditRoute] = useState<IRoute>({
        name: "",
        color: {r: 0, b: 0, g: 0},
        points: []
    });



    const [editColor, setEditColor] = useState<RGBColor>({
        r: 0,
        g: 0,
        b: 0
    })

    const fetchRoutes = useCallback(() => {
        setRoutesLoading(true);
        getAllRoutes().then((result: IRoute[]) => {
            setRoutes(result.map((r) => {
                return {
                    ...r,
                    visible: true
                }
            }));
        }).finally(() => setRoutesLoading(false))

    }, []);

    const addRoute = useCallback((route: IRoute) => {
        createRoute(route).then(() => {
            fetchRoutes();
        }).finally(() => {
            setSiderState(SiderState.LIST)
        })
    }, [])

    const deleteRoute = useCallback((route: IRoute) => {
        removeRoute(route).then(() => {
            fetchRoutes();
        });

    }, [])

    const saveChanges = useCallback((route: IRoute) => {
        updateRoute(route).then(() => {
            fetchRoutes();
        }).finally(() => {
            setSiderState(SiderState.LIST)
        })
    }, [])

    const routeVisible = (index: number, visible: boolean) => {
        setRoutes((cur) => {
            let copy = [...cur];
            copy[index].visible = visible;
            return copy;
        })
    }

    useEffect(() => {
        fetchRoutes();

    }, [])

    return <MapContext.Provider value={{
        routes,
        routesLoading,
        editRoute,
        addRoute,
        setEditRoute,
        siderState,
        setSiderState,
        editorMode,
        setEditorMode,
        saveChanges,
        editColor,
        setEditColor,
        routeVisible,
        deleteRoute,
    }}>{props.children}</MapContext.Provider>
}

export const useMapContext = () => {
    const context = useContext<IMapContext>(MapContext);
    if (context === undefined) throw new Error("Cannot use outside provider");
    return context;
}
