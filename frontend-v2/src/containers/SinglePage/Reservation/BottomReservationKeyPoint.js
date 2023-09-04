import React, { useState } from 'react';
import { IoIosClose } from 'react-icons/io';
import Rating from 'components/UI/Rating/Rating';
import { Button, Modal } from 'antd';
import StickyBookingKeyPoint from 'components/StickyBooking/StickyBookingKeyPoint';
import ReservationKeyPoint from './ReservationKeyPoint';

const BottomReservation = ({ id, title, createdAt, updatedAt, location, completeAddress, contactNumber, contactNumber2, webpage, email }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <StickyBookingKeyPoint
        logo="/images/logo-alt.svg"
        title={title}
        action={
          <Button type="primary" onClick={() => setVisible(true)}>
             Más información
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
        <ReservationKeyPoint
          id={id}
          createdAt={createdAt}
          updatedAt={updatedAt}
          location={location}
          completeAddress={completeAddress}
          contactNumber={contactNumber}
          contactNumber2={contactNumber2}
          webpage={webpage}
          email={email}
        />
        <Button onClick={() => setVisible(false)} className="close">
          <IoIosClose />
        </Button>
      </Modal>
    </>
  );
};

export default BottomReservation;
