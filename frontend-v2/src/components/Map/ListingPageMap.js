import React, { useEffect, useState } from 'react';
import { Marker } from '@react-google-maps/api';
import HotelInfoWindow from './MapInfoWindow';
import MakerImage from './hotelMapMarker.png';

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
          name: item.name,
          location: item.location,
          siteAddress: item.siteAddress          ,
          thumbUrl: item.gallery[0].secure_url,
          // title: item.title,
          // price: item.price,
          rating: 5.0,
          ratingCount: 15,
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
        icon={MakerImage}
        clusterer={clusterer}
        position={{ lat: parseFloat(singlePostLocation.location.lat), lng: parseFloat(singlePostLocation.location.lng) }}
        onClick={() => infoWindowToggle(singlePostLocation.id)}
      >
        {isOpen && markerIndex === singlePostLocation.id ? (
          <HotelInfoWindow
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

