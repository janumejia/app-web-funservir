import React, { Fragment, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/UI/Card/Card';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import TextLink from 'components/UI/TextLink/TextLink';
import RenderReservationForm from './RenderReservationFormKeyPoint';
import { AiOutlineCalendar, AiOutlineInfoCircle, AiOutlineWarning } from "react-icons/ai";
import {
  IoLogoWhatsapp,
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoIosAdd,
} from 'react-icons/io';
import { Button, Popover, message } from 'antd';
import { SocialAccount } from './Reservation.style.js';
import { BsCalendarWeek } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import axios from "../../../settings/axiosConfig"; // Para la petición de registro
import { AuthContext } from 'context/AuthProvider';
import { LISTING_KEYPOINTS_PAGE } from 'settings/constant';

function convertTimeTo12HourFormat(time) {
  if (!time) return null;

  const [hours, minutes] = time.split(':');
  let suffix = '';

  let hour = parseInt(hours, 10);
  if (hour === 0) {
    hour = 12;
    suffix = 'a.m.';
  } else if (hour < 12) {
    suffix = 'a.m.';
  } else if (hour === 12) {
    suffix = 'p.m.';
  } else {
    hour -= 12;
    suffix = 'p.m.';
  }

  return `${hour}:${minutes} ${suffix}`;
}

const timeDiff = (dateStr) => {

  const date = new Date(dateStr);
  const now = new Date();

  const diffInMs = Math.abs(now - date);

  const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30);
  if (diffInMonths > 1) {
    return `${Math.floor(diffInMonths)} meses`;
  }

  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  if (diffInDays > 1) {
    return `${Math.floor(diffInDays)} días`;
  }

  const diffInHours = diffInMs / (1000 * 60 * 60);
  if (diffInHours > 1) {
    return `${Math.floor(diffInHours)} horas`;
  }

  const diffInMinutes = diffInMs / (1000 * 60);
  return `${Math.floor(diffInMinutes)} minutos`;

}

const dateReadeable = (dateStr) => {

  // Parse ISO 8601 date
  const date = new Date(dateStr);

  // Format options
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };

  // Convert to locale string
  const formattedDate = date.toLocaleString('es-ES', options);

  // Replace comma with - 
  let finalDate = formattedDate.replace(',', ' -');
  finalDate = finalDate.replace(/^./, firstLetter => firstLetter.toUpperCase());

  console.log(finalDate);
  // "2:30 PM - agosto 24, 2023"
  return finalDate;
}

const CardHeader = ({ createdAt, updatedAt }) => {
  return (
    <Popover
      className="popover-schedule"
      placement="bottom"
      content={<h4 style={{ "text-align": "center", "fontWeight": "bold", "margin": "5px 0 5px 0" }}> {dateReadeable(updatedAt)} </h4>}
      // title={<h3 style={{ "text-align": "center", "fontWeight": "bold", "margin": "5px 0 5px 0" }} > Horario </h3>}
      trigger="hover"
      open={true}
      // getPopupContainer={getPopupContainer} // Add this line to make the popover follow the button
      // onOpenChange={handleClickChange}
      overlayStyle={{ width: 300 }}
    >
      {createdAt === updatedAt ? "Creado" : "Ultima modificación"} hace {updatedAt ? timeDiff(updatedAt) : (createdAt && timeDiff(createdAt))}
    </Popover>
  );
};

const defaultSchedule = {
  "Lunes": {
    "start": null,
    "end": null
  },
  "Martes": {
    "start": null,
    "end": null
  },
  "Miercoles": {
    "start": null,
    "end": null
  },
  "Jueves": {
    "start": null,
    "end": null
  },
  "Viernes": {
    "start": null,
    "end": null
  },
  "Sabado": {
    "start": null,
    "end": null
  },
  "Domingo": {
    "start": null,
    "end": null
  }
}

const getPopupContainer = (triggerNode) => {
  return triggerNode.parentNode;
};

export default function Reservation({ id, schedule, createdAt, updatedAt, location, completeAddress, contactNumber, contactNumber2, webpage, email, socialFacebook, socialInstagram, socialTwitter, socialWhatsapp }) {
  const { loggedIn } = useContext(AuthContext);
  let navigate = useNavigate();

  const deleteKeyPoint = async () => {
    if (loggedIn || false) {
      message.loading("Cargando", 0);
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/deleteKeyPoint`, { _id: id });
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 3);
          navigate(LISTING_KEYPOINTS_PAGE)
        } else message.warning("Error en la solicitud", 3);
      } else {
        message.warning("Error en la solicitud", 3);
      }
      console.log("reportar");
    }
  };
  
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader createdAt={createdAt} updatedAt={updatedAt} />}
      content={<RenderReservationForm id={id} location={location} completeAddress={completeAddress} contactNumber={contactNumber} contactNumber2={contactNumber2} webpage={webpage} email={email} />}
      footer={
        <>
          <SocialAccount>
            <Popover
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AiOutlineWarning
                    style={{
                      width: "25px",
                      height: "25px",
                      color: 'red',
                    }}
                  />

                  <b style={{ marginLeft: '8px', marginRight: '8px' }}>
                    ¿Estas seguro?
                  </b>
                  <AiOutlineWarning
                    style={{
                      width: "25px",
                      height: "25px",
                      color: 'red',
                    }}
                  />
                </div>
              }
              trigger="click"
              content={
                <div>
                  <p style={{ textAlign: 'justify', marginBottom: '15px' }}>
                    Eliminaras este lugar clave de todo el aplicativo y esta información no podrá ser recuperada
                  </p>
                  <div style={{ 'display': 'flex', 'justify-content': 'center', 'gap': '10px' }} >
                    <Button type='danger' onClick={deleteKeyPoint}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              }
              overlayStyle={{ width: 300 }}
              getPopupContainer={getPopupContainer}
            >
              {"¿Este lugar no existe? "}
              <Link>
                eliminar
              </Link>
            </Popover>
          </SocialAccount>
        </>
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
