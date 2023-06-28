import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/UI/Card/Card';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import TextLink from 'components/UI/TextLink/TextLink';
import RenderReservationForm from './RenderReservationForm';
import { AiOutlineClockCircle, AiOutlineInfoCircle } from "react-icons/ai";
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoIosAdd,
} from 'react-icons/io';
import { Popover } from 'antd';
import { SocialAccount } from './Reservation.style.js';

const CardHeader = ({ availabilityStyle, pricePeriodStyle, linkStyle }) => {
  const styleText1 = {
    fontSize: "16px",
    fontWeight: "bold",
  }

  const styleText2 = {
    fontSize: "16px",
  }

  return (
    <Fragment>
      <Text content={"Abierto ahora:"}
        {...styleText1}
      />
      <Text content=
        {
          <Fragment>
            10:00 a.m. - 8:00 p.m.
          </Fragment>
        }
        {...styleText2}
      />
      <AiOutlineInfoCircle style={{ fontSize: '20px', margin: '3px 0 0 0' }} />

      {/* <Heading
        content={
          <Fragment>
            Abierto ahora <Text as="span" content="/ night" {...pricePeriodStyle} />
          </Fragment>
        }
        {...priceStyle}
      /> */}
      {/* <TextLink link="/#1" content="Contact Hotel" {...linkStyle} /> */}
      {/* <Heading
        content={
          <Fragment>
            $162 <Text as="span" content="/ night" {...pricePeriodStyle} />
          </Fragment>
        }
        {...priceStyle}
      />
      <TextLink link="/#1" content="Contact Hotel" {...linkStyle} /> */}
    </Fragment>
  );
};

export default function Reservation() {
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader />}
      content={<RenderReservationForm />}
      footer={
        <SocialAccount>
          <Popover content="Ir a WhatsApp">
            <a
              href={"/#1"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoWhatsapp className="whatsapp" />
            </a>
          </Popover>
          <Popover content="Ir a Twitter">
            <a
              href={"/#1"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoTwitter className="twitter" />
            </a>
          </Popover>
          <Popover content="Ir a Facebook">
            <a
              href={"/#1"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoFacebook className="facebook" />
            </a>
          </Popover>
          <Popover content="Ir a Instagram">
            <a
              href={"/#1"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoInstagram className="instagram" />
            </a>
          </Popover>
        </SocialAccount>
      }
    />
  );
}

CardHeader.propTypes = {
  // availabilityStyle: PropTypes.object,
  pricePeriodStyle: PropTypes.object,
  linkStyle: PropTypes.object,
};

CardHeader.defaultProps = {
  // availabilityStyle: {
  //   color: '#2C2C2C',
  //   fontWeight: '700',
  // },
  pricePeriodStyle: {
    fontSize: '15px',
    fontWeight: '400',
  },
  linkStyle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#008489',
  },
};
