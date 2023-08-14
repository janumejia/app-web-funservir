import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import Rating from 'components/UI/Rating/Rating';
import { Button, Modal } from 'antd';
import StickyBooking from 'components/StickyBooking/StickyBooking';
import Reservation from './Reservation';

const BottomReservation = ({ title, price, rating, ratingCount, schedule, location, completeAddress, contactNumber, webpage, email, socialFacebook, socialInstagram, socialTwitter, socialWhatsapp }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <StickyBooking
        logo="/images/logo-alt.svg"
        title={title}
        price={price}
        rating={
          <Rating rating={rating} ratingCount={ratingCount} type="mobile" />
        }
        action={
          <Button type="primary" onClick={() => setVisible(true)}>
             Información de contacto
          </Button>
        }
      />

      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        maskStyle={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
        wrapClassName="reservation_modal"
        closable={false}
      >
        <Reservation
          schedule={schedule}
          location={location}
          completeAddress={completeAddress}
          contactNumber={contactNumber}
          webpage={webpage}
          email={email}
          socialFacebook={socialFacebook}
          socialInstagram={socialInstagram}
          socialTwitter={socialTwitter}
          socialWhatsapp={socialWhatsapp}

        />
        <Button onClick={() => setVisible(false)} className="close">
          <IoIosClose />
        </Button>
      </Modal>
    </>
  );
};

export default BottomReservation;
