import React, { Fragment, useContext, useState } from 'react';
import { Button, Popover } from 'antd';
import HtmlLabel from 'components/UI/HtmlLabel/HtmlLabel';
import DatePickerRange from 'components/UI/DatePicker/ReactDates';
import ViewWithPopup from 'components/UI/ViewWithPopup/ViewWithPopup';
import InputIncDec from 'components/UI/InputIncDec/InputIncDec';
import ReservationFormWrapper, {
  FormActionArea,
  FieldWrapper,
  RoomGuestWrapper,
  ItemWrapper,
} from './Reservation.style.js';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import { fontSize } from 'styled-system';
import { MdLocationOn, MdPhone, MdOutlineLaptopChromebook, MdEmail } from "react-icons/md";
import { BsArrowUpRight } from "react-icons/bs";
import { Link } from 'react-router-dom';
import {  Link as LinkScroll } from 'react-scroll';

import { Navigate } from 'react-router-dom';
import { EDIT_KEY_POINT_PAGE } from 'settings/constant.js';
import { AuthContext } from 'context/AuthProvider.js';

const RenderReservationForm = ({ id, location, completeAddress, contactNumber, contactNumber2, webpage, email }) => {
  const { loggedIn } = useContext(AuthContext);
  const [formState, setFormState] = useState({
    startDate: null,
    endDate: null,
    room: 0,
    guest: 0,
  });

  const handleIncrement = (type) => {
    setFormState({
      ...formState,
      [type]: formState[type] + 1,
    });
  };
  const handleDecrement = (type) => {
    if (formState[type] <= 0) {
      return false;
    }
    setFormState({
      ...formState,
      [type]: formState[type] - 1,
    });
  };
  const handleIncDecOnChnage = (e, type) => {
    let currentValue = e.target.value;
    setFormState({
      ...formState,
      [type]: currentValue,
    });
  };
  const updateSearchDataFunc = (value) => {
    setFormState({
      ...formState,
      startDate: value.setStartDate,
      endDate: value.setEndDate,
    });
  };
  const handleSubmit = (e) => {
    <Navigate to={"EDIT_KEY_POINT_PAGE"} state={{ from: location }} />
    // e.preventDefault();
    // alert(
    //   `Start Date: ${formState.startDate}\nEnd Date: ${formState.endDate}\nRooms: ${formState.room}\nGuests: ${formState.guest}`
    // );
  };

  // const handleScrollUp = () => {
  //   window.scrollTo({
  //     top: window.pageYOffset - 30,
  //     behavior: 'smooth',
  //   });
  // };

  const styleHeading = {
    fontSize: "16px",
    fontWeight: "bold",
  }

  const styleText1 = {
    fontSize: "16px",
    // fontWeight: "bold",
  }


  return (
    <ReservationFormWrapper className="form-container" onSubmit={handleSubmit}>
      {/*<FieldWrapper>
        <HtmlLabel htmlFor="dates" content="Dates" />
        <DatePickerRange
          startDateId="checkin-Id"
          endDateId="checkout-id"
          startDatePlaceholderText="Check In"
          endDatePlaceholderText="Check Out"
          updateSearchData={(value) => updateSearchDataFunc(value)}
          numberOfMonths={1}
          small
        />
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="guests" content="Guests" />
        <ViewWithPopup
          key={200}
          noView={true}
          className={formState.room || formState.guest ? 'activated' : ''}
          view={
            <Button type="default">
              <span>Room {formState.room > 0 && `: ${formState.room}`}</span>
              <span>-</span>
              <span>Guest{formState.guest > 0 && `: ${formState.guest}`}</span>
            </Button>
          }
          popup={
            <RoomGuestWrapper>
              <ItemWrapper>
                <strong>Room</strong>
                <InputIncDec
                  id="room"
                  increment={() => handleIncrement('room')}
                  decrement={() => handleDecrement('room')}
                  onChange={(e) => handleIncDecOnChnage(e, 'room')}
                  value={formState.room}
                />
              </ItemWrapper>

              <ItemWrapper>
                <strong>Guest</strong>
                <InputIncDec
                  id="guest"
                  increment={() => handleIncrement('guest')}
                  decrement={() => handleDecrement('guest')}
                  onChange={(e) => handleIncDecOnChnage(e, 'guest')}
                  value={formState.guest}
                />
              </ItemWrapper>
            </RoomGuestWrapper>
          }
        />
      </FieldWrapper>
      <FormActionArea>
        <Button htmlType="submit" type="primary">
          Book Hotel
        </Button>
      </FormActionArea> */}
      <Heading
        className="titleBodyCard"
        content={
          "Ubicación"
        }
        {...styleHeading}
      />
      {/* <a href="#ubicacion"> */}
      <LinkScroll
        key={'ubicacion'}
        className="linkItem"
        activeClass="active"
        to={'ubicacion'}
        spy={true}
        smooth={true}
        hashSpy={true}
        offset={-140}
        duration={300}
        isDynamic={true}
        ignoreCancelEvents={false}
      >


        <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=17&size=600x250&&markers=${location.lat},${location.lng}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY_BRUTE}`} alt="mapa" />
      </LinkScroll>
      {/* </a> */}
      <div className='location' style={{ wordBreak: 'break-all' }}>
        <MdLocationOn style={{ fontSize: '20px', margin: '3px 10px 0 0' }} />
        <Text content=
          {<Fragment>
            {completeAddress}
          </Fragment>}
          {...styleText1}
        />
      </div>
      <FormActionArea>
        {loggedIn ?
          <Link to={"/edit-key-point/" + id}>
            <Button type="primary">
              Modificar lugar clave
            </Button>
          </Link>
          :
          <Popover
            content={"Debes iniciar sesión primero"}
            // placement="bottom"
            //         style={{
            //           "display": "flex",
            //           "align-items": "center"
            //         }}
          >
            <Button type="primary">
              Modificar lugar clave
            </Button>
          </Popover>
        }
      </FormActionArea>
      {/* <div className='telephone'>
        <MdPhone style={{ fontSize: '20px', margin: '3px 10px 0 0' }} />
        <Text content=
          {<Fragment>
            <div style={{ "display": "flex" }}>
              <a href={"tel:+57" + contactNumber} style={{ "margin-right": "10px" }}>+57 {contactNumber}</a>
              {contactNumber2 &&
                <div style={{ "display": "flex" }}>
                  <div style={{ "margin-right": "10px"  }}>-</div>
                  <a href={"tel:+57" + contactNumber2}>+57 {contactNumber2}</a>
                </div>
              }
            </div>
          </Fragment>}
          {...styleText1}
        />
      </div> */}
      {/* {webpage &&
        <div className='website' style={{ wordBreak: 'break-all' }}>
          <MdOutlineLaptopChromebook style={{ fontSize: '20px', margin: '3px 10px 0 0' }} />
          <Text content=
            {<Fragment>
              <a href={webpage} rel="noopener noreferrer" target="_blank">
                {webpage}
                <BsArrowUpRight style={{ fontSize: '13px', margin: '0px 0 0 3px' }} />
              </a>
            </Fragment>}
            {...styleText1}
          />
        </div>
      }
      {email &&
        <div className='email'>
          <MdEmail style={{ fontSize: '20px', margin: '3px 10px 0 0' }} />
          <Text content=
            {<Fragment>
              {email}
            </Fragment>}
            {...styleText1}
          />
        </div>
      } */}
    </ReservationFormWrapper>
  );
};

export default RenderReservationForm;
