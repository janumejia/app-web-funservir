import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/UI/Card/Card';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import TextLink from 'components/UI/TextLink/TextLink';
import RenderReservationForm from './RenderReservationForm';
import { AiOutlineInfoCircle } from "react-icons/ai";
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoIosAdd,
} from 'react-icons/io';
import { Button, Popover } from 'antd';
import { SocialAccount } from './Reservation.style.js';

const CardHeader = ({ availabilityStyle, pricePeriodStyle, linkStyle }) => {

  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };
  const handleClickChange = (open) => {
    setHovered(false);
    setClicked(open);
  };

  const contentInfo = (
    <div style={{ fontSize: "16px" }}>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Lunes:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 8:00 p.m.</div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Martes:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 8:00 p.m.</div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Miércoles:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 8:00 p.m.</div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Jueves:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 8:00 p.m.</div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Viernes:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 8:00 p.m.</div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Sábado:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 11:00 p.m.</div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 33.33%" }}>Domingo:</div>
          <div style={{ flex: "1 1 66.67%" }}>10:00 a.m - 11:00 p.m.</div>
        </div>
      </div>
    </div>
  )

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

      <Popover
        placement="bottomRight"
        content={contentInfo}
        title={<h3 style={{ "text-align": "center", "fontWeight": "bold", "margin": "5px 0 5px 0" }} > Horario </h3>}
        trigger="click"
        open={clicked}
        onOpenChange={handleClickChange}
        overlayStyle={{ width: 300 }}
      >
        <Button
          style={{
            border: "0",
            // width: "100%",
            display: "flex",
            // padding: "0 25px",
            // fontSize: "15px",
            // fontWeight: 400,
            // minHeight: "54px",
            borderRadius: "3px",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#2C2C2C",
            backgroundColor: "#F7F7F7",
          }}
        >
          <AiOutlineInfoCircle style={{ fontSize: '20px', margin: '1px 0 0 0' }} />
        </Button>
      </Popover>


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
