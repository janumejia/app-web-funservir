import React, { Fragment, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { IoIosStar, IoIosStarOutline, IoIosArrowDown } from 'react-icons/io';
import { Row, Col, Button, Input, Checkbox, Divider, Modal } from 'antd';
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
  TextButton,
  ModalTitle,
} from './Review.style';
import { Element } from 'react-scroll';
import { AuthContext } from 'context/AuthProvider';
import { Popover } from 'antd';

const Search = Input.Search;
const CommentBox = (props) => {
  const { reviews } = props;
  return reviews && reviews.length !== 0
    ? reviews.map((singleReview, i) => {
      return (
        <Fragment key={i}>
          <Divider />
          <CommentCard singleReview={singleReview} />
        </Fragment>
      );
    })
    : 'No Review Found';
};

const Review = (props) => {
  const {
    ratingCount,
    reviews,
    statusHeadingStyle,
    filterHeadingStyle,
    ratingLabelStyle,
    ratingCountStyle,
  } = props;

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
              content={`35 Opiniones`}
              {...statusHeadingStyle}
            />
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
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
              <ReviewForm />
            </Modal>
          </RatingSearch>
        </HeaderSection>
        <Row gutter={20}>
          <Col sm={12} lg={9}>
            <Heading content="Calificaciones de los usuarios" {...filterHeadingStyle} />
            <FilterElement>
              <Checkbox onChange={onChange}>
                <Text content="Excelente" as="span" {...ratingLabelStyle} />
                <RatingWrapper>
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStar />
                  <Text content="172" as="span" {...ratingCountStyle} />
                </RatingWrapper>
              </Checkbox>
            </FilterElement>
            {/* End of Filter Element */}

            <FilterElement>
              <Checkbox onChange={onChange}>
                <Text content="Muy bien" as="span" {...ratingLabelStyle} />
                <RatingWrapper>
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStarOutline />
                  <Text content="92" as="span" {...ratingCountStyle} />
                </RatingWrapper>
              </Checkbox>
            </FilterElement>
            {/* End of Filter Element */}

            <FilterElement>
              <Checkbox onChange={onChange}>
                <Text content="Regular" as="span" {...ratingLabelStyle} />
                <RatingWrapper>
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStarOutline />
                  <IoIosStarOutline />
                  <Text content="34" as="span" {...ratingCountStyle} />
                </RatingWrapper>
              </Checkbox>
            </FilterElement>
            {/* End of Filter Element */}

            <FilterElement>
              <Checkbox onChange={onChange}>
                <Text content="Malo" as="span" {...ratingLabelStyle} />
                <RatingWrapper>
                  <IoIosStar />
                  <IoIosStar />
                  <IoIosStarOutline />
                  <IoIosStarOutline />
                  <IoIosStarOutline />
                  <Text content="11" as="span" {...ratingCountStyle} />
                </RatingWrapper>
              </Checkbox>
            </FilterElement>
            {/* End of Filter Element */}
          </Col>
        </Row>
        <CommentBox reviews={reviews} />
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
