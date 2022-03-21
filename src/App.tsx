import React from 'react';
import './App.css';
import { Layout, PageHeader } from "antd";
import MapScreen from "./screens/MapScreen/MapScreen";
import RouteSider from "./components/MapSider/RouteSider/RouteSider";
import MapSider from './components/MapSider/MapSider';

const { Header, Content, Sider } = Layout;


function App() {
    return (
        <Layout>
            <Header>
                <h2>KTG Hackathon</h2>
            </Header>
            <Layout>
                <MapSider />
                <Content>
                    <MapScreen />
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
