import React from 'react';
import useWindowSize from './useWindowSize';
import StickyBookingWrapper, {
  HotelInfo,
  InfoArea,
  Title,
  Logo,
  HotelAction,
  Price,
  ActionBtn,
  HotelRating,
} from './StickyBooking.style';

const StickyBookingKeyPoint = ({ logo, title, price, rating, action, className }) => {
  const addAllClasses = ['sticky_booking'];
  const windowSize = useWindowSize();
  const windowInnerWidth = process.browser && windowSize.innerWidth;

  if (className) {
    addAllClasses.push(className);
  }

  return (
    <StickyBookingWrapper className={addAllClasses.join(' ')}>
      <HotelInfo className="hotel_info">
        <InfoArea>
          <>{title && <Title>{title}</Title>}</>
        </InfoArea>

      </HotelInfo>

      <HotelAction className="hotel_action">
        <ActionBtn>{action}</ActionBtn>
      </HotelAction>
    </StickyBookingWrapper>
  );
};

export default StickyBookingKeyPoint;
