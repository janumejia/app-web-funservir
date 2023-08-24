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
import ListingMap from './ListingMapKeyPoints';
import { SINGLE_POST_PAGE } from 'settings/constant';
import ListingWrapper, { PostsWrapper, ShowMapCheckbox } from './Listing.style';
import NotFoundWrapper, { ContentWrapper } from './NoData.style';
import Image from 'components/UI/Image/Image';
import Heading from 'components/UI/Heading/Heading';
import TextLink from 'components/UI/TextLink/TextLink';
import CategorySearchKeyPoint from './Search/CategorySearch/CategorySearchKeyPoint';
import SectionGridKeyPoints from 'components/SectionGrid/SectionGridKeyPoints';

const SITES_API_URL = `${process.env.REACT_APP_HOST_BACK || '0.0.0.0'}/getKeyPoints`;

// Helper function to extract query parameters from the location object
const getSearchParamsFromLocation = (location) => {
  return location.search && /^\?.+/.test(location.search) ? `${location.search}` : '';
};

// DESCRIPCIÓN:
// Componente para la página de resultados de la búsqueda de sitios, o para mostrar todos los sitios de interés registrados.
export default function ListingKeyPoints() {
  let location = useLocation(); // Devuelve la URL actual. Si se cambia la URL, useLocation también se actualizará. https://dev.to/raaynaldo/react-router-usehistory-uselocation-and-useparams-10cd
  const { width } = useWindowSize(); // Devuelve un objeto que contiene el ancho y alto de la ventana del navegador.
  const [showMap, setShowMap] = useState(false); // Para mostrar el mapa al lado derecho de la pantalla

  const url = `${SITES_API_URL}${getSearchParamsFromLocation(location)}`;
  const { data, loading, loadMoreData, total, limit } = useDataApi(url);

  let columnWidth = [1 / 1, 1 / 2, 1 / 3, 1 / 4, 1 / 5]; // Para que aparezcan 5 columnas de resultados (sin mapa abierto)

  if (showMap) {
    columnWidth = [1 / 1, 1 / 2, 1 / 2, 1 / 2, 1 / 3]; // Cuando está activo el mapa solo aparecen 3 columnas de resultados
  }
  const handleMapToggle = () => { // Al oprimir el botón de "ver mapa": aparece/desaparece
    setShowMap((showMap) => !showMap);
  };

  return (
    <ListingWrapper>

      <Sticky top={82} innerZ={2} activeClass="isHeaderSticky">
        <Toolbar
          left={
            width > 991 ? (
              <CategorySearchKeyPoint location={location} />
            ) : (
              <>

              {/* <FilterDrawer location={location} /> */}
              </>
            )
          }
          right={
            !loading && data && data.length === 0 ?
              <></>
              :
              <ShowMapCheckbox>
                <Checkbox defaultChecked={false} onChange={handleMapToggle}>
                  Ver mapa
                </Checkbox>
              </ShowMapCheckbox>
          }
        />
      </Sticky>

      {!loading && data && data.length === 0 ?
        <NotFoundWrapper>
          <ContentWrapper>
            <img src="/images/no-data.jpg" alt="" style={{ "width": "70%" }} />
            <Heading as="h2" content="Sin resultados para esta búsqueda" />
            <TextLink link="/" content="Volver a inicio" />
          </ContentWrapper>
        </NotFoundWrapper>
        :
        <Fragment>
          <PostsWrapper className={width > 767 && showMap ? 'col-12' : 'col-24'}>
            <SectionGridKeyPoints
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
      }
    </ListingWrapper>
  );
}
