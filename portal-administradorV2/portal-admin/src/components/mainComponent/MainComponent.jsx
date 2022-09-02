import {BrowserRouter, Routes, Route, Link, Outlet} from "react-router-dom"
import Users from "../users/Users"

import React from "react";
import "antd/dist/antd.min.css";
import "./main.css";
import {
  NotificationOutlined,
  SmileOutlined,
  AlertOutlined
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";

const { Header, Content, Sider } = Layout;
/*const items1 = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`
}));*/
const options = ["Elementos Inclusivos", "Usuarios", "Horarios"];
const url = ["elements", "users", "schedule"];
const items2 = [AlertOutlined, SmileOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `${options[index]}`,
      children: new Array(1).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {          
          key: subKey,
          label: (<Link to={url[index]}>{`Gestionar ${options[index]}`}</Link>), //El label es un ReactNode, por eso pude meter el Link aqui
        };
      })
    };
  }
);

const MainComponent = () => (
  <BrowserRouter> {/*Los links deben ir dentro del contexto del Router*/}
    <Layout
    style={{
      minHeight: '100vh',
    }}
  >
    <Header className="header">
      <Link to="/"><div className="logo"><img src="/funservirLogo.jpg" alt="Funservir Logo"/></div></Link>
      {/*<Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={items1}
  />*/}
    </Header>
    
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{
            height: "100%",
            borderRight: 0
          }}
          items={items2}
        />
      </Sider>
      <Layout
        style={{
          padding: "0 24px 24px"
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0"
          }}
        >
        </Breadcrumb>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280
          }}
        >
          <Routes>
          <Route path="/" element={<Outlet/>}/>
          <Route path="/users" element={<Users/>}/>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Layout>
  </BrowserRouter>
  
);

export default MainComponent;
