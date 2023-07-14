import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import TextLink from 'components/UI/TextLink/TextLink';
import Rating from 'components/UI/Rating/Rating';
import { FormOutlined } from '@ant-design/icons';
import Carousel from 'react-multi-carousel'; // Documentación: https://www.npmjs.com/package/react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import GridCard from '../GridCard/GridCard';
import { useNavigate } from 'react-router-dom';
import { EDIT_SITE_PAGE } from 'settings/constant';
import editDataAction from '../../containers/EditListing/EditListingAction';
import { useStateMachine } from 'little-state-machine';
const responsive = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024,
    },
    items: 1,
    paritialVisibilityGutter: 40,
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 464,
    },
    items: 1,
    paritialVisibilityGutter: 30,
  },
};

const PostGrid = ({
  _id,
  name,
  description,
  category,
  contactNumber,
  inclusiveElements,
  gallery,
  siteAddress,
  locality,
  neighborhood,
  rating,
  price,
  ratingCount,
  slug,
  link,
  myProfile
}) => {
  let navigate = useNavigate();
  
  const { actions } = useStateMachine({ editDataAction })
  return (
    <GridCard
      isCarousel={true}
      myProfile={myProfile}
      favorite={
        
          <FormOutlined
            onClick={() => {
              actions.editDataAction({ _id: _id });
              actions.editDataAction({ siteName: name });
              actions.editDataAction({ description: description });
              actions.editDataAction({ category: category });
              actions.editDataAction({ contactNumber: contactNumber });
              const inclusiveElementsAux = inclusiveElements.map((element)=>{
                  return element._id;
                });
              actions.editDataAction({ inclusiveElements: inclusiveElementsAux });
              actions.editDataAction({ sitePhotos: gallery });
              actions.editDataAction({ locality: locality });
              actions.editDataAction({ neighborhood: neighborhood });
              actions.editDataAction({ siteAddress: siteAddress });
              
              navigate(EDIT_SITE_PAGE);
            }}
          />

      }
      location={siteAddress}
      inclusiveElements={inclusiveElements}
      title={<TextLink link={`/post/${slug}`} content={name} />}
      // price={`$${price}/Night - Free Cancellation`}
      rating={<Rating rating={5} ratingCount={35} type="bulk" />}
      viewDetailsBtn={
        <TextLink
          link={`/post/${slug}`}
          icon={<FiExternalLink />}
          content="Ver detalles"
        />
      }
    >
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        containerClass="container"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass=""
        renderDotsOutside={false}
        responsive={responsive}
        showDots={true}
        sliderClass=""
        slidesToSlide={1}
      >
        {(gallery) ? gallery.map(({ secure_url, title }, index) => (
          <img
            src={secure_url}
            alt={title}
            key={index}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'relative',
            }}
          />
        )) : []}
      </Carousel>
    </GridCard>
  );
};

export default PostGrid;
