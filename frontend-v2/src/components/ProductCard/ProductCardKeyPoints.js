import React, { useContext, useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import TextLink from 'components/UI/TextLink/TextLink';
import Rating from 'components/UI/Rating/Rating';
import { FormOutlined } from '@ant-design/icons';
import Carousel from 'react-multi-carousel'; // Documentación: https://www.npmjs.com/package/react-multi-carousel
import Favorite from 'components/UI/Favorite/Favorite';
import 'react-multi-carousel/lib/styles.css';
import GridCardKeyPoint from '../GridCard/GridCardKeyPoint';
import { useNavigate } from 'react-router-dom';
import { EDIT_SITE_PAGE } from 'settings/constant';
import editDataAction from '../../containers/EditListing/EditListingAction';
import { useStateMachine } from 'little-state-machine';
import { AuthContext } from 'context/AuthProvider';

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


const PostGridKeyPoint = ({
  _id,
  title,
  description,
  classification,
  gallery,
  formattedAddress,
  slug,
  myProfile,
  updatedAt,
}) => {
  const { user, setUser } = useContext(AuthContext);
  let navigate = useNavigate();

  const { actions } = useStateMachine({ editDataAction })

  // const [isClose, setIsClose] = useState();
  // const [scheduleWithDate, setScheduleWithDate] = useState();


  // useEffect(() => {
  //   // Función para convertir cadena en objeto de fecha
  //   const convertTimeToDate = (timeString) => {
  //     const [hours, minutes] = timeString.split(':').map(Number);

  //     // Get the current date in UTC
  //     const currentDate = new Date();

  //     // Set the hours and minutes in UTC (adjusting for UTC-5 timezone offset)
  //     currentDate.setUTCHours(hours + 5);
  //     currentDate.setUTCMinutes(minutes);

  //     // Return the date string in "YYYY-MM-DDTHH:mm:ss.sssZ" format
  //     return currentDate.toISOString();
  //   }

  //   // Cambiar el formato de la hora de HH:mm a YYYY-MM-DDTHH:mm:ss.sssZ
  //   const convertSchedule = () => {
  //     const updatedSchedule = {};

  //     for (const day in schedule) {
  //       if (Object.hasOwnProperty.call(schedule, day)) {
  //         const { start, end } = schedule[day];

  //         // Check if start and end are null and handle them accordingly
  //         if (start === null || end === null) {
  //           updatedSchedule[day] = [start, end];
  //         } else {
  //           updatedSchedule[day] = [
  //             convertTimeToDate(start),
  //             convertTimeToDate(end),
  //           ];
  //         }
  //       }
  //     }

  //     return updatedSchedule;
  //   }

  //   const buildIsClose = () => {
  //     const daysOfWeek = Object.keys(schedule);
  //     const result = {};

  //     daysOfWeek.forEach((day) => {
  //       const { start, end } = schedule[day];
  //       const auxIsclose = start === null || end === null;
  //       result[day] = auxIsclose;
  //     });

  //     return (result);
  //   }

  //   if(schedule) { 
  //     setIsClose(buildIsClose());
  //     setScheduleWithDate(convertSchedule());
  //   }

  // }, [])


  return (
    <GridCardKeyPoint
      isCarousel={true}
      myProfile={myProfile}
      // favorite={

      //   <FormOutlined
      //     onClick={() => {
      //       actions.editDataAction({ _id: _id });
      //       actions.editDataAction({ title: title });
      //       actions.editDataAction({ description: description });
      //       actions.editDataAction({ classification: classification });
      //       // actions.editDataAction({ contactNumber: contactNumber });
      //       // actions.editDataAction({ contactNumber2: contactNumber2 });
      //       // const inclusiveElementsAux = inclusiveElements.map((element) => {
      //       //   return element._id;
      //       // });
      //       // moreInfoInclusivity && actions.editDataAction({ moreInfoInclusivity: moreInfoInclusivity });
      //       // actions.editDataAction({ socialInstagram: socialInstagram });
      //       // actions.editDataAction({ socialWhatsapp: socialWhatsapp });
      //       // actions.editDataAction({ socialInstagram: socialInstagram });
      //       // actions.editDataAction({ socialFacebook: socialFacebook });
      //       // actions.editDataAction({ socialTwitter: socialTwitter });
      //       // actions.editDataAction({ webpage: webpage });
      //       actions.editDataAction({ sitePhotos: gallery });
      //       // schedule && actions.editDataAction({ schedule: scheduleWithDate });
      //       // schedule && actions.editDataAction({ isClose: isClose });
      //       // actions.editDataAction({ locality: locality });
      //       // actions.editDataAction({ neighborhood: neighborhood });
      //       actions.editDataAction({ formattedAddress: formattedAddress });

      //       navigate(EDIT_SITE_PAGE);
      //     }}
      //   />

      // }
      // favoriteOriginal={
      //   <Favorite
      //     isActive={user && user.favorites && user.favorites.some(obj => obj._id === _id)? true : false}
      //     _idSite={_id}
      //     userData={user && user}
      //     setUserData={setUser}
      //     // onClick={(event) => {
      //     //   console.log(event);
      //     // }}
      //   />
      // }
      // status={status}
      title={<TextLink link={`/post/${slug}`} content={title} />}
      classification={classification}
      location={formattedAddress}
      updatedAt={updatedAt}
      // inclusiveElements={inclusiveElements}
      // price={`$${price}/Night - Free Cancellation`}
      // rating={<Rating rating={rating} ratingCount={ratingCount} type="bulk" />}
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
        {(gallery && gallery.length > 0) ? gallery.map(({ secure_url, title }, index) => (
          <img
            src={secure_url.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/')} // Para optimizar las imágenes: https://cloudinary.com/blog/adaptive_browser_based_image_format_delivery
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
        )) :
          <div
            style={{
              "display": "flex",
              "align-items": "center",
              "justify-content": "center",
            }}
          >
            <img
              src={"/images/no-photos.svg"} // Para optimizar las imágenes: https://cloudinary.com/blog/adaptive_browser_based_image_format_delivery
              alt={"img"}
              key={"img"}
              draggable={false}
              style={{
                width: '120px',
                height: 'auto',
                margin: "25px 0 0 0",
              }}
            />
          </div>
        }
      </Carousel>
    </GridCardKeyPoint>
  );
};

export default PostGridKeyPoint;
