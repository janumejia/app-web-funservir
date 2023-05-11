import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import {Dropdown, Menu} from "antd";
import { UserOutlined } from "@ant-design/icons";

const closeS = () => {
  localStorage.removeItem('token');
}

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          
          <a
            rel="noopener noreferrer"
            href="/"
          >
            Cerrar Sesión
          </a>
        )
      }
    ]}
    onClick= {closeS}
  />
);


const DropDownAdminuser = ({name}) => (
    <Dropdown.Button id="usrBtn" overlay={menu} icon={<UserOutlined />}>
        {name}
    </Dropdown.Button>
);

export default DropDownAdminuser;