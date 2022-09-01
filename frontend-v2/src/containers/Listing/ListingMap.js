import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Map from 'components/Map/Map';
import useDataApi from 'library/hooks/useDataApi';
import { FixedMap } from './Listing.style';

const ListingMap = ({ data, loading }) => {
  // const { data, loading } = useDataApi('http://localhost:4000/sites');
  if (isEmpty(data) || loading) return <div>Cargando</div>;
  console.log("Mapa data:");
  console.log(data);
  return (
    <FixedMap>
      <Map location={data} multiple={true} />
    </FixedMap>
  );
};

export default ListingMap;
