import React, { useContext, useState } from 'react';
import { Button, Popover, message } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import { IoIosStar, IoIosStarOutline } from 'react-icons/io';
import Rating from '../Rating/Rating';
import { BsThreeDots } from 'react-icons/bs';
import { MdReportProblem } from 'react-icons/md';
import { AuthContext } from 'context/AuthProvider';
import axios from "../../../settings/axiosConfig"; // Para la petición de registro
moment.locale('es');


const CommentCard = ({ singleReview }) => {
  const { loggedIn } = useContext(AuthContext);
  const [openThreeDots, setOpenThreeDots] = useState(false);

  const ReportComment = async () => {
    if (loggedIn) {
      message.loading("Cargando", 0);
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/reportComment`, { _id: singleReview._id });
      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 3);
        } else message.warning("Error en la solicitud", 3);
      }
      console.log("reportar");
    }
  };

  let i;
  let ratingView = [];
  if (singleReview.stars && singleReview.stars !== 0) {
    for (i = 0; i < 5; i++) {
      if (i < singleReview.stars) {
        ratingView.push(<IoIosStar key={i} />);
      } else {
        ratingView.push(<IoIosStarOutline key={i} />);
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
  const reviewRating = singleReview ? singleReview.reviewFields : '';

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
          <div className="rating-area">
            <Popover
              content={
                loggedIn ?
                  <Button
                    icon={<MdReportProblem style={{ fontSize: '24px', color: 'red', marginRight: '8px' }} />}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#fff', // Initial background color
                      color: '#000', // Initial text color
                      border: '0px'
                    }}
                    onClick={ReportComment}
                  >
                    Denunciar comentario
                  </Button>
                  :
                  <Popover
                    content={"Debes iniciar sesión primero"}
                    placement="bottom"
                    style={{
                      "display": "flex",
                      "align-items": "center"
                    }}
                  >
                    <Button
                      icon={<MdReportProblem style={{ fontSize: '24px', color: 'red', marginRight: '8px' }} />}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // To horizontally center the content
                        backgroundColor: '#fff', // Initial background color
                        color: '#000', // Initial text color
                        border: '0px',
                        padding: '5px', // Adjust padding as needed
                        margin: '0', // Remove margin
                      }}
                      onClick={ReportComment}
                      disabled
                    >
                      Denunciar comentario
                    </Button>
                  </Popover>
              }
              trigger="click"
              visible={openThreeDots}
              onVisibleChange={() => setOpenThreeDots(!openThreeDots)}
              placement="bottomRight"
            >
              <BsThreeDots style={{ fontSize: '24px' }} />
            </Popover>
          </div>
        </div>
        <div className="comment-body">
          <h4>{reviewTitle}</h4>
          <p>{content}</p>
        </div>
        <div className="comment-rating">
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
        </div>
      </div >
    </div >
  );
};

export default CommentCard;