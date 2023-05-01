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
            href={process.env.REACT_APP_HOST_BACK}
          >
            Cerrar Sesión
          </a>
        )
      }
    ]}
    onClick= {closeS}
  />
);

const handleButtonClick = (e) => {
  console.log("click left button", e);
};

const DropDownAdminuser = ({name}) => (
    <Dropdown.Button id="usrBtn" onClick={handleButtonClick} overlay={menu} icon={<UserOutlined />}>
        {name}
    </Dropdown.Button>
);

export default DropDownAdminuser;