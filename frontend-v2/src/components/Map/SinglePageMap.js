import React, { useEffect, useState } from 'react';
import { Marker } from '@react-google-maps/api';
import HotelInfoWindow from './MapInfoWindow';
import MakerImage from './hotelMapMarker.png';

const SingleMapDisplay = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [markerIndex, setMarkerIndex] = useState(0);
  const [siteData, setSiteData] = useState([]);

  const infoWindowToggle = (index) => {
    setIsOpen(!isOpen);
    setMarkerIndex(index);
  };

  useEffect(() => {

    const updateSiteData = async () => {
      let auxSiteData = [];

      console.log("location -> ", typeof location)

      auxSiteData.push({
        id: location._id,
        name: location.name,
        location: location.location,
        siteAddress: location.siteAddress,
        thumbUrl: location.gallery[0].secure_url.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/'),
        // title: location.title,
        // price: location.price,
        rating: 5.0,
        ratingCount: 15,
      });


      setSiteData(auxSiteData);
    }

    if (location) updateSiteData();

  }, [location])

  return siteData.map((singlePostLoaction, index) => {
    return (
      <Marker
        key={index}
        icon={MakerImage}
        position={{ lat: parseFloat(singlePostLoaction.location.lat), lng: parseFloat(singlePostLoaction.location.lng) }}
        onClick={() => {
          infoWindowToggle(singlePostLoaction.id);
        }}
      >
        {isOpen && markerIndex === singlePostLoaction.id ? (
          <HotelInfoWindow
            data={singlePostLoaction}
            onCloseClick={() => {
              infoWindowToggle(singlePostLoaction.id);
            }}
          />
        ) : (
          ''
        )}
      </Marker>
    );
  });
};

const HotelMapMarkerSingle = (props) => {
  return <SingleMapDisplay {...props} />;
};

export default HotelMapMarkerSingle;
