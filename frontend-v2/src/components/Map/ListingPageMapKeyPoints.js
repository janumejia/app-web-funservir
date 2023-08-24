import React, { useEffect, useState } from 'react';
import { Marker } from '@react-google-maps/api';
import HotelInfoWindowKeyPoint from './MapInfoWindowKeyPoint';
import MakerImageI from './hotelMapMarkerKeyPointsI4.png';
import MakerImageB from './hotelMapMarkerKeyPointsB4.png';
import MakerImageText from './hotelMapMarker-text.png';

const HotelMapMarkerCluster = ({ location, clusterer }) => {
  console.log("location:")
  console.log(location)
  console.log("clusterer:")
  console.log(clusterer)
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

      await location.forEach((item) => {
        auxSiteData.push({
          id: item._id,
          title: item.title,
          location: item.location,
          formattedAddress: item.formattedAddress,
          classification: item.classification,
          updatedAt: item.updatedAt,
          thumbUrl: item?.gallery?.[0] ? item.gallery[0].secure_url.replace('/image/upload/', '/image/upload/w_500,f_auto,q_auto/') : null,
          // inclusiveElements: item.inclusiveElements,
          // title: item.title,
          // price: item.price,
          // rating: 5.0,
          // ratingCount: 15,
        });
      });

      setSiteData(auxSiteData);
    }

    if (location) updateSiteData();

  }, [location])


  return siteData.map((singlePostLocation, index) => {
    return (
      <Marker
        key={index}
        icon={singlePostLocation && singlePostLocation.classification === "inclusiveElement" ? MakerImageI : MakerImageB}
        label={ singlePostLocation && singlePostLocation.title && ( singlePostLocation.title.length > 16 ? (`${singlePostLocation.title.substr(0, 14)}...`) : singlePostLocation.title.substr(0, 16)) }
        clusterer={clusterer}
        position={{ lat: parseFloat(singlePostLocation.location.lat), lng: parseFloat(singlePostLocation.location.lng) }}
        onClick={() => infoWindowToggle(singlePostLocation.id)}
      >
        {isOpen && markerIndex === singlePostLocation.id ? (
          <HotelInfoWindowKeyPoint
            data={singlePostLocation}
            onCloseClick={() => infoWindowToggle(singlePostLocation.id)}
          />
        ) : (
          ''
        )}
      </Marker>
    );
  });
};

export default HotelMapMarkerCluster;

