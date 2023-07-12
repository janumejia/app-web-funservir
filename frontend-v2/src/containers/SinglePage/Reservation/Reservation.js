import React, { Fragment, useEffect, useState } from 'react';
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

const CardHeader = ({ schedule }) => {
  const [schedule12HourFormat, setSchedule12HourFormat] = useState({})

  const isOpenOrNot = () => {
    if (schedule12HourFormat && !(Object.keys(schedule12HourFormat).length === 0)) {
      const currentDate = new Date();
      let presentDay = currentDate.toLocaleDateString('es-US', { weekday: 'long' }).normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Dia de la semana. Ej. jueves
      const presentHour = currentDate.getHours();
      const presentMinute = currentDate.getMinutes();

      presentDay = presentDay.charAt(0).toUpperCase() + presentDay.slice(1);

      if (!(schedule[presentDay].start === null)) {
        const [hours1, minutes1] = schedule[presentDay].start.split(':').map(Number);
        const [hours2, minutes2] = schedule[presentDay].end.split(':').map(Number);

        const startTotalMinutes = hours1 * 60 + minutes1;
        const endTotalMinutes = hours2 * 60 + minutes2;

        const presetTotalMinutes = presentHour * 60 + presentMinute;

        if (presetTotalMinutes < startTotalMinutes) return (
          <>
            <Text content={"Abre hoy: "}
              {...styleText1}
            />
            <Text content=
              {
                <Fragment>
                  {schedule12HourFormat[presentDay].start + " - " + schedule12HourFormat[presentDay].end}
                </Fragment>
              }
              {...styleText2}
            />
          </>
        )
        else if (presetTotalMinutes < endTotalMinutes) return (
          <>
            <Text content={"Abierto ahora: "}
              {...styleText1}
            />
            <Text content=
              {
                <Fragment>
                  {schedule12HourFormat[presentDay].start + " - " + schedule12HourFormat[presentDay].end}
                </Fragment>
              }
              {...styleText2}
            />
          </>
        )
        else {
          return (
            <>
              <Text content={"Cerrado en este momento"}
                {...styleText1}
              />
            </>
          )
        }
      } else {
        return (
          <>
            <Text content={"Cerrado hoy"}
              {...styleText1}
            />
            {/* <div style={{ "padding": "0 150px 0 0" }}/> */}
          </>
        )
      }
    } else {
      return (
        <Text content={"Cerrado hoy"}
          {...styleText1}
        />
      )
    }
  }

  useEffect(() => {
    const convertScheduleTo12HourFormat = () => {
      const convertedSchedule = {};

      if (schedule) {
        Object.keys(schedule).forEach(day => {
          const { start, end } = schedule[day];

          convertedSchedule[day] = {
            start: convertTimeTo12HourFormat(start),
            end: convertTimeTo12HourFormat(end)
          };
        });
      }

      return convertedSchedule;
    };

    const newSchedule12HourFormat = convertScheduleTo12HourFormat();
    setSchedule12HourFormat(newSchedule12HourFormat);

  }, [schedule])

  const contentInfo = (
    <>
      {
        schedule12HourFormat && !(Object.keys(schedule12HourFormat).length === 0) &&
        <div style={{ fontSize: "16px" }}>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Lunes:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Lunes"].start === null ? "Cerrado" : (schedule12HourFormat["Lunes"].start + " - " + schedule12HourFormat["Lunes"].end)}</div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Martes:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Martes"].start === null ? "Cerrado" : (schedule12HourFormat["Martes"].start + " - " + schedule12HourFormat["Martes"].end)}</div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Miércoles:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Miercoles"].start === null ? "Cerrado" : (schedule12HourFormat["Miercoles"].start + " - " + schedule12HourFormat["Miercoles"].end)}</div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Jueves:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Jueves"].start === null ? "Cerrado" : (schedule12HourFormat["Jueves"].start + " - " + schedule12HourFormat["Jueves"].end)}</div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Viernes:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Viernes"].start === null ? "Cerrado" : (schedule12HourFormat["Viernes"].start + " - " + schedule12HourFormat["Viernes"].end)}</div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Sábado:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Sabado"].start === null ? "Cerrado" : (schedule12HourFormat["Sabado"].start + " - " + schedule12HourFormat["Sabado"].end)}</div>
            </div>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ flex: "1 1 33.33%" }}>Domingo:</div>
              <div style={{ flex: "1 1 66.67%" }}>{schedule12HourFormat["Domingo"].start === null ? "Cerrado" : (schedule12HourFormat["Domingo"].start + " - " + schedule12HourFormat["Domingo"].end)}</div>
            </div>
          </div>
        </div>
      }
    </>
  )

  const styleText1 = {
    fontSize: "16px",
    fontWeight: "bold",
  }

  const styleText2 = {
    fontSize: "16px",
  }

  return (
    <Popover
      className="popover-schedule"
      placement="bottom"
      content={contentInfo}
      title={<h3 style={{ "text-align": "center", "fontWeight": "bold", "margin": "5px 0 5px 0" }} > Horario </h3>}
      trigger="click"
      open={true}
      // onOpenChange={handleClickChange}
      overlayStyle={{ width: 300 }}
    >
      <div style={{ "display": "flex", "justify-content": "center", "align-items": "center" }}>
        <Fragment>
          {isOpenOrNot()}

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
        </Fragment>
      </div>


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

export default function Reservation({ schedule, location, completeAddress, contactNumber, webpage, email, socialFacebook, socialInstagram, socialTwitter, socialWhatsapp }) {
  return (
    <Card
      className="reservation_sidebar"
      header={<CardHeader schedule={typeof schedule === 'undefined' ? defaultSchedule : schedule} />}
      content={<RenderReservationForm location={location} completeAddress={completeAddress} contactNumber={contactNumber} webpage={webpage} email={email} />}
      footer={
        <>
          <SocialAccount>
            {socialWhatsapp &&
              <Popover content="Ir a WhatsApp">
                <a
                  href={"/#1"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoWhatsapp className="whatsapp" />
                </a>
              </Popover>
            }
            {socialTwitter &&
              <Popover content="Ir a Twitter">
                <a
                  href={"/#1"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoTwitter className="twitter" />
                </a>
              </Popover>
            }
            {socialFacebook &&
              <Popover content="Ir a Facebook">
                <a
                  href={"/#1"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoFacebook className="facebook" />
                </a>
              </Popover>
            }
            {socialInstagram &&
              <Popover content="Ir a Instagram">
                <a
                  href={"/#1"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoInstagram className="instagram" />
                </a>
              </Popover>
            }
            {!(socialWhatsapp && socialTwitter && socialFacebook && socialInstagram) && <span>Sin redes sociales registradas</span>}
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
