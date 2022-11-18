import {Routes, Route, Link} from "react-router-dom"
import Users from "../users/Users"
import InclusiveElements from "../inclusiveElements/InclusiveElements";
import DropDownAdminuser from "../dropDownAdminUser/DropDownAdminUser";
import React from "react";
import "antd/dist/antd.min.css";
import "./main.css";
import jwt_decode from "jwt-decode";
import {
  CalendarOutlined,
  SmileOutlined,
  AlertOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Space } from "antd";

const { Header, Content, Sider } = Layout;

const options = ["Elementos Inclusivos", "Usuarios", "Horarios", "Categorias"]; //Estos son los menus
const url = ["elements", "users", "schedule", "categories"]; //Estas son las URL
const items2 = [AlertOutlined, SmileOutlined, CalendarOutlined, AppstoreOutlined].map(
  (icon, index) => {
    return {
      key: url[index],
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



const MainComponent = () => {
  let href=window.location.href.split('/');
  href=href[3]
  const token = jwt_decode(localStorage.getItem('token'));
  return(
  <> {/*Los links deben ir dentro del contexto del Router*/}
  
    <Layout
    style={{
      minHeight: '100vh',
    }}
  >
    <Header className="header">
      <Space>
      <Link to="/dashboard"><div className="logo"><img src="/funservirLogo.jpg" alt="Funservir Logo"/></div></Link>
      <DropDownAdminuser name={token.name}></DropDownAdminuser>
      </Space>
    </Header>
    
    <Layout>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          style={{
            height: "100%",
            borderRight: 0
          }}
          items={items2}
          defaultOpenKeys={[href]} //Ultimar detalles para que quede seleccionado también
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
          <Route path="/users" element={<Users/>}/>
          <Route path="/elements" element={<InclusiveElements/>}/>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Layout>
  </>
  )
        };

export default MainComponent;
