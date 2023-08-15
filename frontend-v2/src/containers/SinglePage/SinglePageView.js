import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'library/hooks/useLocation';
import Sticky from 'react-stickynode';
import { Row, Col, Modal, Button } from 'antd';
import Container from 'components/UI/Container/Container';
import Loader from 'components/Loader/Loader';
import useWindowSize from 'library/hooks/useWindowSize';
import Description from './Description/Description';
import Amenities from './Amenities/Amenities';
import Location from './Location/Location';
import Owner from './Owner/Owner';
import MoreAboutInclusivity from './MoreAboutInclusivity/MoreAboutInclusivity';
import Review from './Review/Review';
import Reservation from './Reservation/Reservation';
import BottomReservation from './Reservation/BottomReservation';
import TopBar from './TopBar/TopBar';
import SinglePageWrapper, { PostImage } from './SinglePageView.style';
import PostImageGallery from './ImageGallery/ImageGallery';
import useDataApi from 'library/hooks/useDataApi';
import isEmpty from 'lodash/isEmpty';
import { FaImages } from "react-icons/fa";
import { GrClose } from "react-icons/gr";
import { size } from 'lodash';
import { bottom } from 'styled-system';

const SinglePage = () => {
  let { slug } = useParams();
  const { href } = useLocation();
  const [isModalShowing, setIsModalShowing] = useState(false);
  const { width } = useWindowSize();

  let url = `${process.env.REACT_APP_HOST_BACK}/sites/`;
  if (slug) {
    url += slug;
  }
  const { data, loading } = useDataApi(url);
  
  if (isEmpty(data) || loading) return <Loader />;
  const {
    _id,
    name,
    description,
    category,
    rating,
    ratingCount,
    ratingStars,
    comments,
    gallery,
    siteAddress,
    locality,
    neighborhood,
    moreInfoInclusivity,
    location,
    inclusiveElements,
    author,
    owner,
    schedule,
    contactNumber,
    contactNumber2,
    webpage,
    email,
    socialFacebook,
    socialInstagram,
    socialTwitter,
    socialWhatsapp
  } = data[0];
  console.log(data);
  return (
    <SinglePageWrapper>
      <PostImage hasSecondAndThirdImage={gallery[1] && gallery[2]}>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => setIsModalShowing(true)}
        >
          <img
            className="main-image"
            src={gallery[0].secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')}
            alt=""
          />
          <img
            className="second-image"
            src={gallery[1] && gallery[1].secure_url && gallery[1].secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')}
            alt=""
          />
          <img
            className="third-image"
            src={gallery[2] && gallery[2].secure_url && gallery[2].secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')}
            alt=""
          />
        </div>
        <Button
          type="primary"
          onClick={() => setIsModalShowing(true)}
          className="image_gallery_button"
          icon={<FaImages />}
        >
          <span style={{ "margin": "0 0 0 9px" }}>
            Ver fotos
          </span>
        </Button>
        <Modal
          visible={isModalShowing}
          onCancel={() => setIsModalShowing(false)}
          footer={null}
          width="100%"
          maskStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
          wrapClassName="image_gallery_modal"
          closable={false}
        >
          <Fragment>
            <PostImageGallery gallery={gallery} />
            <Button
              onClick={() => setIsModalShowing(false)}
              className="image_gallery_close"
            >
              <svg width="16.004" height="16" viewBox="0 0 16.004 16">
                <path
                  id="_ionicons_svg_ios-close_2_"
                  d="M170.4,168.55l5.716-5.716a1.339,1.339,0,1,0-1.894-1.894l-5.716,5.716-5.716-5.716a1.339,1.339,0,1,0-1.894,1.894l5.716,5.716-5.716,5.716a1.339,1.339,0,0,0,1.894,1.894l5.716-5.716,5.716,5.716a1.339,1.339,0,0,0,1.894-1.894Z"
                  transform="translate(-160.5 -160.55)"
                  fill="#909090"
                />
              </svg>
            </Button>
          </Fragment>
        </Modal>
      </PostImage>

      <TopBar title={name} shareURL={href} author={author} media={gallery} />

      <Container fullWidth={true} fluid={true}>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              content={description}
              title={name}
              location={siteAddress + ", " + neighborhood + ", " + locality}
              rating={rating}
              ratingCount={ratingCount}
              category={category}
              categoryStyle={{
                fontSize: "16px",
                padding: "0px 0px 10px 0px",
              }}
              locationMetaStyle={{
                fontSize: "16px",
              }}
              titleStyle={{
                fontSize: "26px",
                lineHeight: "2",
              }}
            // contentStyle={{
            //   fontFamily: "Arial",
            //   fontWeight: "bold",
            //   textAlign: "center",
            //   lineHeight: "1.5",
            //   letterSpacing: "1px",
            //   color: "blue",
            //   fontSize: "16px",
            //   margin: "10px",
            //   padding: "20px",
            // }}
            // fontFamily="Arial" fontWeight="bold" textAlign="center" 
            />
            <Amenities inclusiveElements={inclusiveElements} moreInfoInclusivity={moreInfoInclusivity} />
            {/* <MoreAboutInclusivity info={data[0]} /> */}
            <Location
              location={data[0]}
              locationMetaStyle={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#909090',
                mb: ['14px', '20px', '14px'],
              }}
            />
            <Owner
              owner={owner}
            />
          </Col>
          <Col xl={8}>
            {width > 1200 ? (
              <Sticky
                innerZ={0}
                activeClass="isSticky"
                top={202}
                bottomBoundary="#reviewSection"
              >
                <Reservation
                  schedule={schedule}
                  location={location}
                  completeAddress={siteAddress + ", " + neighborhood + ", " + locality}
                  contactNumber={contactNumber}
                  contactNumber2={contactNumber2}
                  webpage={webpage}
                  email={email}
                  socialFacebook={socialFacebook}
                  socialInstagram={socialInstagram}
                  socialTwitter={socialTwitter}
                  socialWhatsapp={socialWhatsapp}
                />
              </Sticky>
            ) : (
              <BottomReservation
                title={name}
                rating={rating}
                ratingCount={ratingCount}
                schedule={schedule}
                location={location}
                completeAddress={siteAddress + ", " + neighborhood + ", " + locality}
                contactNumber={contactNumber}
                contactNumber2={contactNumber2}
                webpage={webpage}
                email={email}
                socialFacebook={socialFacebook}
                socialInstagram={socialInstagram}
                socialTwitter={socialTwitter}
                socialWhatsapp={socialWhatsapp}
              />
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col xl={16}>
            <Review
              _id={_id}
              comments={comments}
              ratingCount={ratingCount}
              rating={rating}
              owner={owner}
              ratingStars={ratingStars}
            />
          </Col>
          <Col xl={8} />
        </Row>
      </Container>
    </SinglePageWrapper>
  );
};

export default SinglePage;
