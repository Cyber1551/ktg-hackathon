import axios from "axios";
import {IRoute} from "../interfaces/route";

const API = "https://ktg-hackathon-backend.herokuapp.com";

export const getAllRoutes = async ():Promise<IRoute[]> => {
    const result = await axios.get(`${API}/routes`);
    return result.data;
}

export const createRoute = async (route: IRoute):Promise<boolean> => {
    const result = await axios.post(`${API}/createRoute`, {
        ...route
    });
    return result.data;
}

export const removeRoute = async (route: IRoute):Promise<boolean> => {
    const result = await axios.delete(`${API}/deleteRoute`, {
        data: route
    });
    return result.data;
}

export const updateRoute = async (route: IRoute):Promise<boolean> => {
    const result = await axios.put(`${API}/updateRoute`, {
        ...route
    });
    return result.data;
}

