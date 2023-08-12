import React, { useContext } from 'react';
import { TopHotelsGrid, LuxaryHotelsGrid } from './Grid';
import SearchArea from './Search/Search';
import LocationGrid from './Location/Location';
import { LayoutContext } from 'context/LayoutProvider';
import { Waypoint } from 'react-waypoint'; // Componente de React para ejecutar una función cada vez que se hace scroll: https://www.npmjs.com/package/react-waypoint

// DESCRIPCIÓN:
// Componente de la pantalla principal. Aquí se incluye el carrusel de imágenes, la barra de búsqueda y en la parte inferior las categorías de los sitios
const Home = () => {
  const [, dispatch] = useContext(LayoutContext);
  return (
    <>
      <SearchArea />
      <Waypoint
        onEnter={() => dispatch({ type: 'HIDE_TOP_SEARCHBAR' })}
        onLeave={() => dispatch({ type: 'SHOW_TOP_SEARCHBAR' })}
      />
      
      {/* Secciones que tiene la pantalla principal/Home */}
      {/* <LocationGrid /> */}
      {/* <TopHotelsGrid /> */}
      {/* <LuxaryHotelsGrid /> */}
    </>
  );
};

export default Home;
