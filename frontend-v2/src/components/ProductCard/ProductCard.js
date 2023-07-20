import React, { useEffect, useState } from 'react';
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

// const daysOfTheWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

const PostGrid = ({
  _id,
  name,
  description,
  category,
  contactNumber,
  contactNumber2,
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
  myProfile,
  socialWhatsapp,
  socialInstagram,
  socialFacebook,
  socialTwitter,
  webpage,
  schedule,
}) => {
  let navigate = useNavigate();

  const { actions } = useStateMachine({ editDataAction })

  const [isClose, setIsClose] = useState();
  const [scheduleWithDate, setScheduleWithDate] = useState();

  
  useEffect(() => {
    // Función para convertir cadena en objeto de fecha
    const convertTimeToDate = (timeString) => {
      const [hours, minutes] = timeString.split(':').map(Number);
  
      // Get the current date in UTC
      const currentDate = new Date();
  
      // Set the hours and minutes in UTC (adjusting for UTC-5 timezone offset)
      currentDate.setUTCHours(hours + 5);
      currentDate.setUTCMinutes(minutes);
  
      // Return the date string in "YYYY-MM-DDTHH:mm:ss.sssZ" format
      return currentDate.toISOString();
    }
  
    // Cambiar el formato de la hora de HH:mm a YYYY-MM-DDTHH:mm:ss.sssZ
    const convertSchedule = () => {
      const updatedSchedule = {};

      for (const day in schedule) {
        if (Object.hasOwnProperty.call(schedule, day)) {
          const { start, end } = schedule[day];
  
          // Check if start and end are null and handle them accordingly
          if (start === null || end === null) {
            updatedSchedule[day] = [start, end];
          } else {
            updatedSchedule[day] = [
              convertTimeToDate(start),
              convertTimeToDate(end),
            ];
          }
        }
      }
  
      return updatedSchedule;
    }

    const buildIsClose = () => {
      const daysOfWeek = Object.keys(schedule);
      const result = {};

      daysOfWeek.forEach((day) => {
        const { start, end } = schedule[day];
        const auxIsclose = start === null || end === null;
        result[day] = auxIsclose;
      });

      return (result);
    }

    if(schedule) { 
      setIsClose(buildIsClose());
      setScheduleWithDate(convertSchedule());
    }

  }, [])


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
            actions.editDataAction({ contactNumber2: contactNumber2 });
            const inclusiveElementsAux = inclusiveElements.map((element) => {
              return element._id;
            });
            actions.editDataAction({ inclusiveElements: inclusiveElementsAux });
            actions.editDataAction({ socialWhatsapp: socialWhatsapp });
            actions.editDataAction({ socialInstagram: socialInstagram });
            actions.editDataAction({ socialFacebook: socialFacebook });
            actions.editDataAction({ socialTwitter: socialTwitter });
            actions.editDataAction({ webpage: webpage });
            actions.editDataAction({ sitePhotos: gallery });
            schedule && actions.editDataAction({ schedule: scheduleWithDate });
            schedule && actions.editDataAction({ isClose: isClose });
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
