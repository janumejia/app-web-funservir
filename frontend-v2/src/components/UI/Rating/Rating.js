import React from 'react';
import PropTypes from 'prop-types';
import { IoIosStar, IoIosStarOutline, IoIosStarHalf } from 'react-icons/io';

const Rating = (props) => {
  const { rating, ratingCount, type, ratingFieldName } = props;
  let i, floorValue;
  let ratingView = [];
  let halfStar = false;
  if (rating && rating !== 0) {
    floorValue = Math.floor(rating);
    for (i = 0; i < 5; i++) {
      if (i < floorValue) {
        ratingView.push(<IoIosStar key={i} />);
      } else {
        if (!halfStar && floorValue !== rating) {
          ratingView.push(<IoIosStarHalf key={i} />)
          halfStar = true;
        } else {
          ratingView.push(<IoIosStarOutline key={i} />)
        }
      }
    }
  }
  let listingCondition;
  if (rating && 4.9 <= rating && rating <= 5) {
    listingCondition = 'Excelente';
  } else if (rating && 4 <= rating && rating < 4.9) {
    listingCondition = 'Muy bueno';
  } else if (rating && 3.5 <= rating && rating < 4) {
    listingCondition = 'Bueno';
  } else if (rating && 3 <= rating && rating < 3.5) {
    listingCondition = 'Regular';
  } else if (rating && 2 <= rating && rating < 3) {
    listingCondition = 'Malo';
  } else if (rating && rating >= 1) {
    listingCondition = 'Terrible';
  } else {
    listingCondition = '';
  }

  let showRatingCount;
  if (ratingCount) {
    showRatingCount = `(` + ratingCount + `)`;
  } else {
    showRatingCount = 'Sin calificaciones';
  }

  return (
    <>
      {(showRatingCount === 'Sin calificaciones' && type === 'bulk') ?
        (
          <strong>
            {`${showRatingCount}`}
          </strong>
        )
        :
        (
          <>
            {type && type === 'bulk' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{ratingView}</span>
                <strong style={{ margin: '-3px 3px 0 7px' }}>
                  {`${listingCondition}`}
                </strong>
                <strong >
                  {`${showRatingCount}`}
                </strong>
              </div>
            ) : (type && type === 'mobile' ?
              <div style={{ alignItems: 'center' }}>
                <span >{ratingView}</span>
                <br/>
                <strong style={{ margin: '0px 3px 0 0px' }}>
                  {`${listingCondition}`}
                </strong>
                <strong >
                  {`${showRatingCount}`}
                </strong>
              </div>
              :
              <>
                <span>{ratingFieldName}</span> {ratingView}
              </>
            )}
          </>
        )}

    </>
  );
};

Rating.propTypes = {
  type: PropTypes.string.isRequired,
  ratingCount: PropTypes.number,
  rating: PropTypes.number,
  ratingFieldName: PropTypes.string,
};

export default Rating;
