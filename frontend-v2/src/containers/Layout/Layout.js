import React, { Fragment } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout as LayoutWrapper } from 'antd';
import useWindowSize from 'library/hooks/useWindowSize';
import LayoutProvider from 'context/LayoutProvider';
import {
  LISTING_POSTS_PAGE,
  LOGIN_PAGE,
  REGISTRATION_PAGE,
  REGISTRATION_SITE_OWNER_PAGE,
  AGENT_PROFILE_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
  ADD_SITE_PAGE,
  PRICING_PLAN_PAGE,
  SINGLE_POST_PAGE,
  PRIVACY_PAGE,
  CHANGE_PASSWORD_PAGE,
  FORGET_PASSWORD_PAGE,
  AGENT_IMAGE_EDIT_PAGE,
  AGENT_PASSWORD_CHANGE_PAGE,
  REGISTRATION_USER,
  REGISTRATION_OWNER,
  ADD_KEY_POINT_PAGE,
  EDIT_SITE_PAGE,
  LISTING_KEYPOINTS_PAGE,
  EDIT_KEY_POINT_PAGE,
} from 'settings/constant';
import Header from './Header/Header';
import Footer from './Footer/Footer';
const { Content } = LayoutWrapper;

export default function Layout() {
  let location = useLocation();
  const { width } = useWindowSize();
  const singlePageUrlFromConst = SINGLE_POST_PAGE.split('/');
  const singlePageUrlFormLocation = location.pathname.split('/');

  return (
    <LayoutProvider>
      {location.pathname === LOGIN_PAGE ||
      location.pathname === CHANGE_PASSWORD_PAGE ||
      location.pathname === FORGET_PASSWORD_PAGE ||
      location.pathname === REGISTRATION_PAGE ||
      location.pathname === REGISTRATION_SITE_OWNER_PAGE  ? (
        <Content>
          <Outlet />
        </Content>
      ) : (
        <Fragment>
          <Header />
          <Content>
            <Outlet />
          </Content>
          {location.pathname === LISTING_POSTS_PAGE ||
          location.pathname === LISTING_KEYPOINTS_PAGE ||
          location.pathname === ADD_SITE_PAGE ||
          location.pathname === ADD_KEY_POINT_PAGE ||
          `/${singlePageUrlFormLocation?.[1]}` === EDIT_KEY_POINT_PAGE ||
          location.pathname === EDIT_SITE_PAGE ||
          location.pathname === AGENT_PROFILE_PAGE ||
          location.pathname === CHANGE_PASSWORD_PAGE ||
          location.pathname === FORGET_PASSWORD_PAGE ||
          location.pathname === REGISTRATION_USER ||
          location.pathname === REGISTRATION_OWNER ||
          location.pathname ===
            `${AGENT_ACCOUNT_SETTINGS_PAGE + AGENT_IMAGE_EDIT_PAGE}` ||
          location.pathname ===
            `${AGENT_ACCOUNT_SETTINGS_PAGE + AGENT_PASSWORD_CHANGE_PAGE}` ||
          location.pathname === AGENT_ACCOUNT_SETTINGS_PAGE ? (
            <div style={{ height: '33px' }} />
          ) : (
            <Fragment>
              <Footer />
              {singlePageUrlFormLocation[1] === singlePageUrlFromConst[1] && (
                <Fragment>
                  {width < 1200 && <div style={{ height: '74px' }} />}
                </Fragment>
              )}
            </Fragment>
          )}
        </Fragment>
      )}
    </LayoutProvider>
  );
}
