import React from 'react';
import { Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import { IoIosStar, IoIosStarOutline } from 'react-icons/io';
//import LikeDislike from './LikeDislike';
//import Rating from '../Rating/Rating';
moment.locale('es');

export default class App extends React.Component {
  render() {
  const { singleReview } = this.props;
  let i;
  let ratingView = [];
  if (singleReview.stars && singleReview.stars !== 0) {
    for (i = 0; i < 5; i++) {
      if (i < singleReview.stars) {
        ratingView.push(<IoIosStar key={i} />);
      } else {
          ratingView.push(<IoIosStarOutline key={i} />)
      }
    }
  }

    
    const reviewAuthorFirstName = singleReview
      ? singleReview.userId.name
      : '';
    const reviewAuthorLastName = singleReview
      ? singleReview.userId.lastName
      : '';
    const authorName = reviewAuthorFirstName + ' ' + reviewAuthorLastName;
    const content = singleReview ? singleReview.content : '';
    const reviewTitle = singleReview ? singleReview.title : '';
    const commentDate = singleReview ? singleReview.createdAt : '';
    const postTime = new Date(commentDate).getTime();
    const authorAvatar = singleReview ? singleReview.userId.profilePicture : '';
    //const reviewRating = singleReview ? singleReview.reviewFields : '';

    return (
      <div className="comment-area">
        <div className="comment-wrapper">
          <div className="comment-header">
            <div className="avatar-area">
              <div className="author-avatar">
                <img src={authorAvatar} alt={authorName} />
              </div>
              <div className="author-info">
                <h3 className="author-name">{authorName}</h3>
                {ratingView && (
                  <div className="author-rating">{ratingView}</div>
                )}
                <div className="comment-date">
                  <Popover
                    placement="bottom"
                    content={moment(commentDate).format(
                      'dddd, MMMM Do YYYY, h:mm:ss a'
                    )}
                  >
                    <span>{`Publicado ${moment(postTime).fromNow()}`}</span>
                  </Popover>
                </div>
              </div>
            </div>
            {/* <div className="rating-area">
              <LikeDislike />
            </div> */}
          </div>
          <div className="comment-body">
            <h4>{reviewTitle}</h4>
            <p>{content}</p>
          </div>
          {/* <div className="comment-rating">
            {reviewRating && reviewRating.length !== 0
              ? reviewRating.map((singleReviewRating, i) => {
                  return (
                    <div className="rating-widget" key={i}>
                      <Rating
                        key={i}
                        rating={singleReviewRating.rating}
                        ratingFieldName={singleReviewRating.ratingFieldName}
                        type="individual"
                      />
                    </div>
                  );
                })
              : ''}
          </div> */}
        </div>
      </div>
    );
  }
}
