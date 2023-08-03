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
  } else if (rating && 3 <= rating && rating < 4) {
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
    showRatingCount = `(` + ratingCount + ` calificaciones)`;
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
              <>
                <span>{ratingView}</span>
                <strong>
                  {` ${listingCondition}`}
                </strong>
                <strong>
                  {`${showRatingCount}`}
                </strong>
              </>
            ) : (
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
