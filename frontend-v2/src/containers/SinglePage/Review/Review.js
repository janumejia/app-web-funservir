import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosStar, IoIosStarOutline/*, IoIosArrowDown*/, IoIosStarHalf } from 'react-icons/io';
import { Row, Col, Button, /*Input, Checkbox,*/ Divider, Modal, Space } from 'antd';
import CommentCard from 'components/UI/CommentCard/CommentCard';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import ReviewForm from './ReviewForm';
import ReviewWrapper, {
  HeaderSection,
  RatingStatus,
  FilterElement,
  RatingSearch,
  RatingWrapper,
  //TextButton,
  ModalTitle,
} from './Review.style';
import { Element } from 'react-scroll';
import { AuthContext } from 'context/AuthProvider';
import { Popover, Typography } from 'antd';
const { Title } = Typography;

//const Search = Input.Search;
const CommentBox = (props) => {
  const { comments } = props;
  return comments && comments.length !== 0
    ? comments.map((singleReview, i) => {
      return (
        <Fragment key={i}>
          <Divider />
          <CommentCard singleReview={singleReview} />
        </Fragment>
      );
    })
    : <Title style={{ marginTop: '2rem' }} level={4}>Nadie ha comentado aún... ¡Sé el primero en comentar!</Title>
};

const Review = (props) => {
  const {
    ratingStars,
    rating,
    _id,
    owner,
    comments,
    statusHeadingStyle,
    filterHeadingStyle,
    ratingLabelStyle,
    ratingCountStyle,
  } = props;

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
  const { loggedIn } = useContext(AuthContext);

  const [state, setState] = useState({
    review: false,
    language: false,
  });
  const handleModalOpen = (key) => {
    setState({ ...state, [key]: true });
  };
  const handleModalClose = (key) => {
    setState({ ...state, [key]: false });
  };
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  return (
    <Element name="opiniones" className="opiniones">
      <ReviewWrapper>
        <HeaderSection>
          <RatingStatus>
            <Heading
              content={`${comments.length} Opiniones`}
              {...statusHeadingStyle}
            />
            {ratingView}
          </RatingStatus>
          <RatingSearch>
            {/* <Search
              placeholder="Search reviews"
              onSearch={(value) => console.log(value)}
            /> */}
            {!loggedIn ?
              <Popover
                content={"Debes iniciar sesión primero"}
                trigger="hover"
              >
                <Button type="primary">
                  Escribir opinión
                </Button>
              </Popover>
              :
              <Button type="primary" onClick={() => handleModalOpen('review')}>
                Escribir opinión
              </Button>
            }
            <Modal
              visible={state.review}
              onCancel={() => handleModalClose('review')}
              footer={null}
              width="100%"
              maskStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              wrapClassName="review_modal"
            >
              <ModalTitle>Escribe tu opinión aquí</ModalTitle>
              <ReviewForm siteId={_id} userId={owner && owner._id} close={() => handleModalClose('review')} />
            </Modal>
          </RatingSearch>
        </HeaderSection>
        <Row gutter={20}>
          <Col sm={12} lg={9}>
            <Heading content="Calificaciones de los usuarios" {...filterHeadingStyle} />
            <FilterElement>
              <RatingWrapper>
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <Space> <Text content="Excelente " as="span" {...ratingLabelStyle} /></Space>
                <Text content={`(${ratingStars["5"]})`} as="span" {...ratingCountStyle} />
              </RatingWrapper>
            </FilterElement>
            {/* End of Filter Element */}

            <FilterElement>
              <RatingWrapper>
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStarOutline />
                <Space> <Text content="Muy bien " as="span" {...ratingLabelStyle} /></Space>
                <Text content={`(${ratingStars["4"]})`} as="span" {...ratingCountStyle} />
              </RatingWrapper>
            </FilterElement>
            {/* End of Filter Element */}

            <FilterElement>
              <RatingWrapper>
                <IoIosStar />
                <IoIosStar />
                <IoIosStar />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <Space> <Text content="Regular " as="span" {...ratingLabelStyle} /></Space>
                <Text content={`(${ratingStars["3"]})`} as="span" {...ratingCountStyle} />
              </RatingWrapper>
            </FilterElement>
            {/* End of Filter Element */}

            <FilterElement>
              <RatingWrapper>
                <IoIosStar />
                <IoIosStar />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <Space> <Text content="Malo " as="span" {...ratingLabelStyle} /></Space>
                <Text content={`(${ratingStars["2"]})`} as="span" {...ratingCountStyle} />
              </RatingWrapper>
            </FilterElement>
            <FilterElement>
              <RatingWrapper>
                <IoIosStar />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <IoIosStarOutline />
                <Space> <Text content="Terrible " as="span" {...ratingLabelStyle} /></Space>
                <Text content={`(${ratingStars["1"]})`} as="span" {...ratingCountStyle} />

              </RatingWrapper>
            </FilterElement>
            {/* End of Filter Element */}
          </Col>
        </Row>
        <CommentBox comments={comments} />
      </ReviewWrapper>
    </Element>
  );
};

Review.propTypes = {
  statusHeadingStyle: PropTypes.object,
  filterHeadingStyle: PropTypes.object,
  ratingLabelStyle: PropTypes.object,
  ratingCountStyle: PropTypes.object,
};

Review.defaultProps = {
  statusHeadingStyle: {
    color: '#2C2C2C',
    fontSize: ['17px', '20px', '25px'],
    mr: '10px',
  },
  filterHeadingStyle: {
    color: '#2C2C2C',
    fontSize: '15px',
    fontWeight: '700',
    lineHeight: '1.2',
    mb: '0.5em',
  },
  ratingLabelStyle: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#2c2c2c',
    flex: '1',
  },
  ratingCountStyle: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#2c2c2c',
    ml: '8px',
  },
};

export default Review;
