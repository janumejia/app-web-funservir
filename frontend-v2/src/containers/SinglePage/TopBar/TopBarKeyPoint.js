import React, { useContext } from 'react';
import Sticky from 'react-stickynode';
import {
  FaceBookShare,
  TwitterShare,
  LinkedInShare,
  PinterestShare,
} from 'components/SocialShare/SocialShare';
import { Button, Menu, Dropdown } from 'antd';
import Favorite from 'components/UI/Favorite/Favorite';
import ScrollBar from 'components/UI/ScrollBar/ScrollBar';
import { TobBarWrapper, ButtonGroup } from '../SinglePageView.style';
import { AuthContext } from 'context/AuthProvider';

const topBarMenu = [
  {
    name: 'General',
    target: 'general',
  },
  // {
  //   name: 'Inclusividad',
  //   target: 'inclusividad',
  // },
  {
    name: 'Ubicación',
    target: 'ubicacion',
  },
  // {
  //   name: 'Opiniones',
  //   target: 'opiniones',
  // },
];

const SocialShareMenu = (props) => {
  return (
    <Menu>
      <Menu.Item key={0}>
        <TwitterShare {...props} />
      </Menu.Item>
      <Menu.Item key={1}>
        <FaceBookShare {...props} />
      </Menu.Item>
      <Menu.Item key={2}>
        <LinkedInShare {...props} />
      </Menu.Item>
      <Menu.Item key={3}>
        <PinterestShare {...props} />
      </Menu.Item>
    </Menu>
  );
};

const SideButtons = (props) => {
  const {user, setUser } = useContext(AuthContext);

  return (
    <ButtonGroup>
      <Favorite
        className="ant-btn"
        content="Guardar"
        isActive={user && user.favorites && user.favorites.some(obj => obj._id === props._id) ? true : false}
        _idSite={props._id}
        userData={user}
        setUserData={setUser}
      />
      <Dropdown
        placement="bottomRight"
        overlay={() => <SocialShareMenu {...props} />}
        overlayClassName="social_share_menu"
      >
        <Button className="ant-dropdown-link" style={{ width: 130 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.309 15.537">
            <path
              d="M80.68,101.873,74.507,96.1a.316.316,0,0,0-.245-.105c-.193.009-.438.144-.438.35v2.9a.187.187,0,0,1-.158.179c-6.138.941-8.724,5.535-9.639,10.3-.035.188.219.363.337.214a11.158,11.158,0,0,1,9.275-4.7.216.216,0,0,1,.184.21v2.844a.375.375,0,0,0,.634.232l6.217-5.876a.483.483,0,0,0,.153-.368A.586.586,0,0,0,80.68,101.873Z"
              transform="translate(-63.271 -95.242)"
            />
          </svg>
          Compartir
        </Button>
      </Dropdown>
    </ButtonGroup>
  );
};

const TopBar = (props) => {
  const { title, shareURL, author, media, _id } = props;
  return (
    <TobBarWrapper>
      <Sticky innerZ={1} top={80} activeClass="isSticky">
        <ScrollBar
          menu={topBarMenu}
          // other={
          //   <SideButtons
          //     media={media}
          //     author={author}
          //     title={title}
          //     shareURL={shareURL}
          //     _id={_id}
          //   />
          // }
        />
      </Sticky>
    </TobBarWrapper>
  );
};

export default TopBar;
