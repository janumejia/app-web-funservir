import React, { useState, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import Sticky from 'react-stickynode';
import { Checkbox } from 'antd';
import useWindowSize from 'library/hooks/useWindowSize';
import useDataApi from 'library/hooks/useDataApi';
import Toolbar from 'components/UI/Toolbar/Toolbar';
import { PostPlaceholder } from 'components/UI/ContentLoader/ContentLoader';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import FilterDrawer from './Search/MobileSearchView';
import CategorySearch from './Search/CategorySearch/CategorySearch';
import ListingMap from './ListingMap';
import { SINGLE_POST_PAGE } from 'settings/constant';
import ListingWrapper, { PostsWrapper, ShowMapCheckbox } from './Listing.style';

// DESCRIPCIÓN:
// Componente para la página de resultados de la búsqueda de sitios, o para mostrar todos los sitios de interés registrados.
export default function Listing() {
  let location = useLocation(); // Devuelve la URL actual. Si se cambia la URL, useLocation también se actualizará. https://dev.to/raaynaldo/react-router-usehistory-uselocation-and-useparams-10cd
  const { width } = useWindowSize(); // Devuelve un objeto que contiene el ancho y alto de la ventana del navegador.
  const [showMap, setShowMap] = useState(false); // Para mostrar el mapa al lado derecho de la pantalla

  let url = `${process.env.REACT_APP_HOST_BACK}` || '0.0.0.0'; // La URL para pedir a la API todos los sitios de interés y poder mostrarlo (0.0.0.0 no es valido, pero Heroku lo detectará y le asignará una valida)
  url += '/sites';

  if (location.search) {
    url += location.search;
    url = url.replace('?','/');
  }

  const { data, loading, loadMoreData, total, limit } = useDataApi(url);
  
  let columnWidth = [1 / 1, 1 / 2, 1 / 3, 1 / 4, 1 / 5]; // Para que aparezcan 5 columnas de resultados (sin mapa abierto)
  
  
  console.log("-x-x-x-x-x-x")
  console.log(location.search)
  console.log("-x-x-x-x-x-x")

  if (showMap) {
    columnWidth = [1 / 1, 1 / 2, 1 / 2, 1 / 2, 1 / 3]; // Cuando está activo el mapa solo aparecen 3 columnas de resultados
  }
  const handleMapToggle = () => { // Al oprimir el botón de "ver mapa": aparece/desaparece
    setShowMap((showMap) => !showMap);
    console.log("data: ", data)
  };

  return (
    <ListingWrapper>
      <Sticky top={82} innerZ={1} activeClass="isHeaderSticky">
        <Toolbar
          left={
            width > 991 ? (
              <CategorySearch location={location} />
            ) : (
              <FilterDrawer location={location} />
            )
          }
          right={
            <ShowMapCheckbox>
              <Checkbox defaultChecked={false} onChange={handleMapToggle}>
                Ver mapa
              </Checkbox>
            </ShowMapCheckbox>
          }
        />
      </Sticky>

      <Fragment>
        <PostsWrapper className={width > 767 && showMap ? 'col-12' : 'col-24'}>
          <SectionGrid
            link={SINGLE_POST_PAGE}
            columnWidth={columnWidth}
            data={data}
            totalItem={total.length}
            loading={loading}
            limit={limit}
            handleLoadMore={loadMoreData}
            placeholder={<PostPlaceholder />}
          />
        </PostsWrapper>

        {showMap && <ListingMap data={data} loading={loading} />}
      </Fragment>
    </ListingWrapper>
  );
}
